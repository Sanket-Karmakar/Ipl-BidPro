import { Match } from "../models/match.models.js";
import { fetchMatchesFromAPI } from "./cricApiService.js";

export async function updateMatches() {
    try {
        const matches = await fetchMatchesFromAPI();

        if (!matches || !Array.isArray(matches)) {
            throw new Error("Invalid data from CricAPI");
        }

        for (const match of matches) {
            const updateData = {
                matchId: match.id || match.uniqueId,
                name: match.name,
                matchType: match.matchType,
                status: match.status,
                venue: match.venue,
                date: match.date ? new Date(match.date) : null,
                dateTimeGMT: match.dateTimeGMT ? new Date(match.dateTimeGMT) : null,
                teams: match.teams,
                teamInfo: match.teamInfo,
                score: match.score,
                series_id: match.series_id,
                fantasyEnabled: match.fantasyEnabled ?? false,
                hasSquad: match.hasSquad ?? false,
                matchStarted: match.matchStarted ?? false,
                matchEnded: match.matchEnded ?? false,
            };

            await Match.findOneAndUpdate(
                { matchId: updateData.matchId},  
                { $set: updateData },
                { upsert: true, new: true }
            );
        }
        console.log("Matches updated successfully ✅");
    } catch (err) {
        console.error("Error updating matches:", err.message);
    }
}