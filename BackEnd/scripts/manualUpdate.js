import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.CRICAPI_BASE_URL;
const API_KEY = process.env.CRIC_API_KEY;

async function checkMatchInfo() {
    const matchId = "3093f73b-639c-464c-8497-b6b238b5b9af";
    const response = await axios.get(`${BASE_URL}/match_info`, {
        params: { apikey: API_KEY, id: matchId },
        timeout: 15000
    });
    console.log('Match Info Score:', JSON.stringify(response.data.data?.score, null, 2));
}

checkMatchInfo().catch(console.error);
