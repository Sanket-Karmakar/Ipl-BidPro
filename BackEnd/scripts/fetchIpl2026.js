// scripts/fetchIpl2026.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import axios from 'axios';
import { Match } from '../src/models/match.models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from '../src/db/index.js';

const CRIC_API_KEY = process.env.CRIC_API_KEY;
const SERIES_ID = '87c62aac-bc3c-4738-ab93-19da0690488f'; // IPL 2026

async function fetchIPLMatches() {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('Connected to MongoDB.');

        console.log(`Fetching IPL 2026 matches from CricAPI...`);
        const url = `https://api.cricapi.com/v1/series_info?apikey=${CRIC_API_KEY}&id=${SERIES_ID}`;
        const response = await axios.get(url);
        
        if (!response.data || !response.data.data || !response.data.data.matchList) {
            console.error('Failed to retrieve matchList from CricAPI');
            process.exit(1);
        }

        const matches = response.data.data.matchList;
        console.log(`Found ${matches.length} matches in the series.`);

        let inserted = 0;
        let updated = 0;

        for (const match of matches) {
            // Append series_id manually just in case CricAPI omits it in the matchList
            match.series_id = SERIES_ID;
            
            try {
                await Match.upsertFromApi(match);
                inserted++;
            } catch (err) {
                console.error(`Error saving match ${match.id}:`, err.message);
            }
        }

        console.log(`Successfully processed ${inserted} matches.`);
        process.exit(0);
    } catch (error) {
        console.error('Error fetching IPL matches:', error);
        process.exit(1);
    }
}

fetchIPLMatches();
