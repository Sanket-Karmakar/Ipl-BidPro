import { Match } from "../models/match.models.js";
import { fetchMatchesFromAPI, fetchMatchDetails } from "./cricApiService.js";


const IPL_SERIES_ID = '87c62aac-bc3c-4738-ab93-19da0690488f';

export async function updateMatches() {
    try {
        const matches = await fetchMatchesFromAPI();

        if (!matches || !Array.isArray(matches)) {
            throw new Error("Invalid data from CricAPI");
        }

        let upserted = 0;
        let skipped = 0;

        for (const m of matches) {
            // Filter: ONLY Indian Premier League matches
            if (m.series_id !== IPL_SERIES_ID) {
                skipped++;
                continue;
            }

            // Use normalized unique id property names
            const rawId = m.uniqueId ?? m.unique_id ?? m.id ?? m.match_id ?? m.matchId;
            if (!rawId) {
                skipped++;
                continue;
            }

            // --- LIVE SCORE ENHANCEMENT ---
            // If match is ongoing but score is missing, fetch details
            if (m.matchStarted && !m.matchEnded && (!m.score || m.score.length === 0)) {
                try {
                    console.log(`[CricAPI] Live match detected (${rawId}) — fetching detailed info...`);
                    const details = await fetchMatchDetails(rawId);
                    if (details && details.score) {
                        m.score = details.score;
                    }
                } catch (e) {
                    console.warn(`[CricAPI] Failed to fetch details for live match ${rawId}`);
                }
            }

            // Convert dateTimeGMT if string
            if (m.dateTimeGMT && typeof m.dateTimeGMT === 'string') {
                try { m.dateTimeGMT = new Date(m.dateTimeGMT); } catch (e) {}
            }

            try {
                await Match.upsertFromApi(m);
                upserted++;
            } catch (err) {
                // if duplicate key error occurs despite upsert, log and continue
                console.error(`Failed upsert for match ${rawId}:`, err.message ?? err);
            }
        }

        console.log(`IPL Matches processed: upserted=${upserted}, skipped (non-IPL)=${skipped}`);

        // --- AUTO-BACKFILL: Fix completed matches with missing scores ---
        await backfillMissingScores();
    } catch (err) {
        console.error("Error updating matches:", err.message ?? err);
    }

}

/**
 * Finds completed IPL matches that have empty score arrays
 * and tries to fetch their scores via match_info API.
 * Runs automatically after every updateMatches cycle.
 */
async function backfillMissingScores() {
    try {
        const missingScoreMatches = await Match.find({
            series_id: IPL_SERIES_ID,
            matchEnded: true,
            $or: [
                { score: { $exists: false } },
                { score: { $size: 0 } },
                { score: null }
            ]
        }).lean();

        if (missingScoreMatches.length === 0) return;

        console.log(`[Backfill] Found ${missingScoreMatches.length} completed matches missing scores — attempting to fix...`);

        let fixed = 0;
        for (const m of missingScoreMatches) {
            try {
                const details = await fetchMatchDetails(m.matchId);
                if (details && details.score && details.score.length > 0) {
                    await Match.findOneAndUpdate(
                        { matchId: m.matchId },
                        { $set: { score: details.score, status: details.status || m.status } }
                    );
                    fixed++;
                    console.log(`[Backfill] ✅ Fixed score for: ${m.name}`);
                }
            } catch (e) {
                // silently skip — will retry next cycle
            }
        }

        if (fixed > 0) {
            console.log(`[Backfill] Fixed ${fixed}/${missingScoreMatches.length} matches this cycle.`);
        }
    } catch (err) {
        console.error("[Backfill] Error:", err.message);
    }
}


/** Query helpers used by controllers */
export async function getUpcomingMatches() {
    const now = new Date();
    // show upcoming that are scheduled in future and not started/ended, exclude TBC placeholders, ONLY IPL
    return await Match.find({
        $and: [
            { series_id: IPL_SERIES_ID },
            { dateTimeGMT: { $gt: now } },
            { matchStarted: { $ne: true } },
            { matchEnded: { $ne: true } },
            { "teams.0": { $ne: "TBC" } },
            { "teams.1": { $ne: "TBC" } },
            { venue: { $ne: "TBC, TBC" } }
        ]
    }).sort({ dateTimeGMT: 1 }).lean();
}

export async function getOngoingMatches() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // ongoing: either matchStarted true or status ONGOING, ONLY IPL
    return await Match.find({
        $and: [
            { series_id: IPL_SERIES_ID },
            { $or: [{ matchStarted: true }, { status: 'ONGOING' }] },
            { matchEnded: { $ne: true } },
            { dateTimeGMT: { $gte: sevenDaysAgo } }
        ]
    }).sort({ dateTimeGMT: 1 }).lean();
}

export async function getCompletedMatches() {
    // completed, ONLY IPL
    return await Match.find({
        $and: [
            { series_id: IPL_SERIES_ID },
            { $or: [{ matchEnded: true }, { status: 'COMPLETED' }] }
        ]
    }).sort({ dateTimeGMT: -1 }).lean();
}

export async function getIpl2026Matches() {
    return await Match.find({
        series_id: IPL_SERIES_ID
    }).sort({ dateTimeGMT: 1 }).lean();
}


