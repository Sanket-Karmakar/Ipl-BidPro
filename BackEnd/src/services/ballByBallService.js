import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.CRICAPI_BASE_URL;
const API_KEY = process.env.CRIC_API_KEY;

/**
 * Fetch ball-by-ball data from CricAPI (Fantasy API)
 * Endpoint: GET /match_bbb?apikey=KEY&id=MATCH_ID
 * Returns: each ball's runs, extras, wicket info, commentary
 */
export async function fetchBallByBallFromAPI(matchId) {
    try {
        console.log(`⚾ Fetching ball-by-ball data from CricAPI for matchId=${matchId}`);
        const response = await axios.get(`${BASE_URL}/match_bbb`, {
            params: { apikey: API_KEY, id: matchId },
            timeout: 15000,
        });

        if (!response.data || response.data.status !== "success") {
            console.warn(`⚠️ Ball-by-ball fetch failed for ${matchId}: ${response.data?.reason || "unknown"}`);
            return null;
        }

        const data = response.data.data;
        if (!data) {
            console.warn(`⚠️ No ball-by-ball data returned for ${matchId}`);
            return null;
        }

        console.log(`✅ Ball-by-ball data fetched successfully for ${matchId}`);
        return data;
    } catch (error) {
        console.error(`❌ Error fetching ball-by-ball for ${matchId}:`, error.message);
        return null;
    }
}
