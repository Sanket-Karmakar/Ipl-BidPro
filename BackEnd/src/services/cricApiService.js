import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.CRICAPI_BASE_URL;
const API_KEY = process.env.CRIC_API_KEY;

// fetch all matches (defensive parsing & normalization)
export async function fetchMatchesFromAPI () {
    try {
        const response = await axios.get(`${BASE_URL}/matches`, {
            params: { apikey: API_KEY },
            timeout: 15000
        });

        // log useful debugging info but avoid huge dumps in prod
        console.log("CricAPI response status:", response.status);

        if (!response.data) {
            throw new Error('Empty response from CricAPI');
        }

        // many cricapi endpoints use response.data.data or response.data.matches
        const payload = response.data.data ?? response.data.matches ?? response.data;

        if (!Array.isArray(payload)) {
            // Try to handle object with nested data
            if (Array.isArray(payload.matches)) {
                return payload.matches;
            }
            console.warn(`Unexpected CricAPI structure, returning empty. Received keys: ${Object.keys(response.data)}`);
            return [];
        }

        const now = new Date();

        // Normalize fields: uniqueId, dateTimeGMT, matchEnded, matchStarted
        const normalized = payload.map(m => {
            return {
                ...m,
                uniqueId: m.uniqueId ?? m.unique_id ?? m.id ?? m.match_id ?? m.matchId,
                dateTimeGMT: m.dateTimeGMT ?? m.date_time_gmt ?? m.dateTime ?? m.start_time ?? m.date,
                matchEnded: m.matchEnded ?? m.match_ended ?? m.ended ?? false,
                matchStarted: m.matchStarted ?? m.match_started ?? m.started ?? false
            };
        });

        // choose upcoming by date and not ended (but don't filter out ongoing if desired elsewhere)
        const upcoming = normalized.filter(m => {
            try {
                if (!m.dateTimeGMT) return false;
                const dt = new Date(m.dateTimeGMT);
                return dt > now && !m.matchEnded;
            } catch (e) {
                return false;
            }
        });

        console.log("CricAPI: fetched", normalized.length, "raw matches —", upcoming.length, "upcoming selected");
        return normalized; // return normalized full set; service layer will pick what to upsert
    } catch (error) {
        console.error(`Error fetching matches from CricAPI:`, error?.message ?? error);
        return [];
    }
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