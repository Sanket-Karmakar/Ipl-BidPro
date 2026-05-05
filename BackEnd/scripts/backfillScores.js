import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import { Match } from '../src/models/match.models.js';
dotenv.config();

const BASE_URL = process.env.CRICAPI_BASE_URL;
const API_KEY = process.env.CRIC_API_KEY;

// These 3 matches are missing scores — let's try the scorecard endpoint 
const missingMatches = [
    { id: '05d33d50-3efe-42f9-98f7-1f363a2f153a', name: 'MI vs SRH (41st)' },
    { id: '7e0789c4-6bdc-48da-a67f-49213f6d731e', name: 'GT vs RCB (42nd)' },
    { id: '3093f73b-639c-464c-8497-b6b238b5b9af', name: 'RR vs DC (43rd)' }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

mongoose.connect('mongodb+srv://karmakarsanket98:sanketkarmakar98@cluster0.fnvtabb.mongodb.net/ipl-bidpro').then(async () => {
    for (const m of missingMatches) {
        console.log(`\nChecking ${m.name} (${m.id})...`);
        
        // Try match_scorecard
        try {
            const scRes = await axios.get(`${BASE_URL}/match_scorecard`, {
                params: { apikey: API_KEY, id: m.id },
                timeout: 15000
            });
            if (scRes.data.status === 'success' && scRes.data.data) {
                const sc = scRes.data.data;
                console.log(`  Scorecard available! Score: ${JSON.stringify(sc.score)}`);
                if (sc.score && sc.score.length > 0) {
                    await Match.findOneAndUpdate(
                        { matchId: m.id },
                        { $set: { score: sc.score, scorecardData: sc, scorecardLastFetched: new Date() } }
                    );
                    console.log(`  ✅ Updated from scorecard endpoint`);
                    continue;
                }
            } else {
                console.log(`  Scorecard not available: ${scRes.data.reason}`);
            }
        } catch (e) {
            console.log(`  Scorecard error: ${e.message}`);
        }
        
        // Try match_info
        try {
            const infoRes = await axios.get(`${BASE_URL}/match_info`, {
                params: { apikey: API_KEY, id: m.id },
                timeout: 15000
            });
            const info = infoRes.data.data;
            console.log(`  match_info status: "${info?.status}", score: ${JSON.stringify(info?.score)}`);
        } catch (e) {
            console.log(`  match_info error: ${e.message}`);
        }
        
        await delay(1500);
    }
    
    // Final check on all matches
    const allCompleted = await Match.find({
        series_id: '87c62aac-bc3c-4738-ab93-19da0690488f',
        matchEnded: true
    }).lean();
    
    const withScore = allCompleted.filter(m => m.score && m.score.length > 0);
    const withoutScore = allCompleted.filter(m => !m.score || m.score.length === 0);
    console.log(`\n--- FINAL STATUS ---`);
    console.log(`With scores: ${withScore.length}/${allCompleted.length}`);
    withoutScore.forEach(m => console.log(`  Missing: ${m.name}`));
    
    process.exit(0);
}).catch(console.error);
