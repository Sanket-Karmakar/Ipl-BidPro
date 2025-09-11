import { Match } from "../models/match.models.js";
import { fetchMatchesFromAPI } from "./cricApiService.js";


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


