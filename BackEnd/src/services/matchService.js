import { Match } from "../models/match.models.js";
import { fetchMatchesFromAPI } from "./cricApiService.js";

/**
 * updateMatches:
 * - fetch raw matches from API (normalized array)
 * - for each item, attempt an idempotent upsert using Match.upsertFromApi
 * - skip items missing matchId
 */
export async function updateMatches() {
    try {
        const matches = await fetchMatchesFromAPI();

        if (!matches || !Array.isArray(matches)) {
            throw new Error("Invalid data from CricAPI");
        }

        const now = new Date();
        let upserted = 0;
        let skipped = 0;

        for (const m of matches) {
            // Use normalized unique id property names
            const rawId = m.uniqueId ?? m.unique_id ?? m.id ?? m.match_id ?? m.matchId;
            if (!rawId) {
                skipped++;
                continue;
            }

            // Convert dateTimeGMT if string
            if (m.dateTimeGMT && typeof m.dateTimeGMT === 'string') {
                try { m.dateTimeGMT = new Date(m.dateTimeGMT); } catch (e) {}
            }

            // If match has already started or ended and you only want upcoming inserted, skip.
            // But to keep full record (ongoing/completed), we will upsert all matches. If you ONLY
            // want upcoming, you can uncomment the continue below.
            // const matchDate = m.dateTimeGMT ? new Date(m.dateTimeGMT) : null;
            // if (!matchDate || matchDate <= now || m.matchEnded || m.matchStarted) { skipped++; continue; }

            try {
                await Match.upsertFromApi(m);
                upserted++;
            } catch (err) {
                // if duplicate key error occurs despite upsert, log and continue
                console.error(`Failed upsert for match ${rawId}:`, err.message ?? err);
            }
        }

        console.log(`Matches processed: upserted=${upserted}, skipped=${skipped}`);
    } catch (err) {
        console.error("Error updating matches:", err.message ?? err);
    }
}

/** Query helpers used by controllers */
export async function getUpcomingMatches() {
    const now = new Date();
    // show upcoming that are scheduled in future and not started/ended, exclude TBC placeholders
    return await Match.find({
        $and: [
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
    // ongoing: either matchStarted true or status ONGOING
    return await Match.find({
        $and: [
            { $or: [{ matchStarted: true }, { status: 'ONGOING' }] },
            { matchEnded: { $ne: true } }
        ]
    }).sort({ dateTimeGMT: 1 }).lean();
}

export async function getCompletedMatches() {
    return await Match.find({
        $or: [{ matchEnded: true }, { status: 'COMPLETED' }]
    }).sort({ dateTimeGMT: -1 }).lean();
}

