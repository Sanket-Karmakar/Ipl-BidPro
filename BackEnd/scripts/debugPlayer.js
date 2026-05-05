import mongoose from 'mongoose';
import { Player } from '../src/models/player.models.js';
import { fetchAndStorePlayerStats } from '../src/services/playerStats.service.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

mongoose.connect('mongodb+srv://karmakarsanket98:sanketkarmakar98@cluster0.fnvtabb.mongodb.net/ipl-bidpro').then(async () => {
    const incompletePlayers = await Player.find({
        $or: [
            { stats: { $size: 0 } },
            { stats: { $exists: false } },
            { role: { $exists: false } },
            { role: '' },
            { role: null }
        ]
    }).select('name playerId').lean();
    
    console.log(`Found ${incompletePlayers.length} incomplete players to fix.\n`);
    
    let fixed = 0;
    let failed = 0;
    
    for (const p of incompletePlayers) {
        console.log(`Fixing: ${p.name}...`);
        try {
            const result = await fetchAndStorePlayerStats(p.name);
            if (result && result.stats && result.stats.length > 0) {
                console.log(`  ✅ Fixed! Role: ${result.role}, Stats: ${result.stats.length}`);
                fixed++;
            } else {
                console.log(`  ⚠️ Fetched but still no stats`);
                failed++;
            }
        } catch (err) {
            console.log(`  ❌ Error: ${err.message}`);
            failed++;
        }
        await delay(1500); // Rate limiting
    }
    
    console.log(`\n--- SUMMARY ---`);
    console.log(`Fixed: ${fixed}, Failed: ${failed}, Total: ${incompletePlayers.length}`);
    
    process.exit(0);
}).catch(console.error);
