import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

const CRICAPI_BASE_URL = 'https://api.cricapi.com/v1';
const API_KEY = process.env.CRIC_API_KEY;

// function for fetching all matches
export async function fetchMatchesFromAPI () {
    try {
        const response = await axios.get(`${CRICAPI_BASE_URL}/matches`, {
            params: { apikey: API_KEY },
        });

        if ( !response.data || !response.data.data ) {
            throw new Error('Unexpected CricAPI response format');
        }

        return response.data.data;
    } catch (error) {
        console.log(`Error fetching matches from CricAPI: `, error.message);
        return [];
    }
}

// function for fetching match with given id
export async function fetchMatchDetails (matchId) {
    try {
        const response = await axios.get(`${CRICAPI_BASE_URL}/match_info`, {
            params: { apikey: API_KEY, id: matchId },
        });
        return response.data;        
    } catch (error) {
        console.log(`Error fetching match details: `, error.message);
        throw new Error(`Failed to fetch match details from CricAPI`);
    }
}

