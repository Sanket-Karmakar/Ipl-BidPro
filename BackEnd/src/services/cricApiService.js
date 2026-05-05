import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.CRICAPI_BASE_URL;
const API_KEY = process.env.CRIC_API_KEY;

// fetch all matches (prefers currentMatches for live scores)
export async function fetchMatchesFromAPI() {
    try {
        // 1. Try fetching from currentMatches (better for live scores)
        console.log("[CricAPI] Fetching matches from currentMatches...");
        const response = await axios.get(`${BASE_URL}/currentMatches`, {
            params: { apikey: API_KEY },
            timeout: 15000
        });

        if (!response.data || response.data.status !== "success") {
            console.warn("[CricAPI] currentMatches failed, falling back to /matches...");
            // Fallback to /matches
            const fbResponse = await axios.get(`${BASE_URL}/matches`, {
                params: { apikey: API_KEY },
                timeout: 15000
            });
            return processMatchesPayload(fbResponse.data);
        }

        return processMatchesPayload(response.data);
    } catch (error) {
        console.error(`Error fetching matches from CricAPI:`, error?.message ?? error);
        return [];
    }
}

function processMatchesPayload(data) {
    if (!data) return [];
    const payload = data.data ?? data.matches ?? data;

    if (!Array.isArray(payload)) {
        if (payload.matches && Array.isArray(payload.matches)) return payload.matches;
        console.warn("Unexpected CricAPI structure, returning empty.");
        return [];
    }

    // Normalize fields
    return payload.map(m => {
        return {
            ...m,
            uniqueId: m.uniqueId ?? m.unique_id ?? m.id ?? m.match_id ?? m.matchId,
            dateTimeGMT: m.dateTimeGMT ?? m.date_time_gmt ?? m.dateTime ?? m.start_time ?? m.date,
            matchEnded: m.matchEnded ?? m.match_ended ?? m.ended ?? false,
            matchStarted: m.matchStarted ?? m.match_started ?? m.started ?? false
        };
    });
}

// fetch match details by id (keeps behavior but returns normalized object)
export async function fetchMatchDetails (matchId) {
    try {
        const response = await axios.get(`${BASE_URL}/match_info`, {
            params: { apikey: API_KEY, id: matchId },
            timeout: 15000
        });
        if (!response.data) throw new Error('Empty match details response');
        // normalize some keys if necessary
        const data = response.data.data ?? response.data;
        return data;
    } catch (error) {
        console.error(`Error fetching match details for ${matchId}:`, error?.message ?? error);
        throw new Error('Failed to fetch match details from CricAPI');
    }
}