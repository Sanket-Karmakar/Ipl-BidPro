// BackEnd/src/scripts/seedPlayer.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../db/index.js';
import { Player } from '../models/player.models.js';

async function main() {
  try {
    await connectDB();
    console.log('[seed] DB connected');

    const filePath = path.join(process.cwd(), 'src', 'scripts', 'players.seed.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    const players = Array.isArray(json) ? json : [json];

    if (!players.length) {
      console.log('[seed] No players found in JSON. Aborting.');
      return;
    }

    // Upsert by playerId
    const ops = players.map(p => ({
      updateOne: {
        filter: { playerId: p.playerId || p.id || p.pid || p.name },
        update: { $set: p },
        upsert: true
      }
    }));

    const result = await Player.bulkWrite(ops, { ordered: false });
    console.log('[seed] Done:', {
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount
    });
  } catch (err) {
    console.error('[seed] Error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('[seed] DB connection closed');
  }
}

main();
