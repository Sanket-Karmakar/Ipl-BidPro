import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.CRICAPI_BASE_URL;
const API_KEY = process.env.CRIC_API_KEY;

/**
 * Fetch full match scorecard from CricAPI
 * Endpoint: GET /match_scorecard?apikey=KEY&id=MATCH_ID
 * Returns: innings-wise batting, bowling, extras, fall of wickets
 */
export async function fetchScorecardFromAPI(matchId) {
    try {
        console.log(`🏏 Fetching scorecard from CricAPI for matchId=${matchId}`);
        const response = await axios.get(`${BASE_URL}/match_scorecard`, {
            params: { apikey: API_KEY, id: matchId },
            timeout: 15000,
        });

        if (!response.data || response.data.status !== "success") {
            console.warn(`⚠️ Scorecard fetch failed for ${matchId}: ${response.data?.reason || "unknown"}`);
            return null;
        }

        const data = response.data.data;
        if (!data) {
            console.warn(`⚠️ No scorecard data returned for ${matchId}`);
            return null;
        }

        console.log(`✅ Scorecard fetched successfully for ${matchId}`);
        return data;
    } catch (error) {
        console.error(`❌ Error fetching scorecard for ${matchId}:`, error.message);
        return null;
    }
}
