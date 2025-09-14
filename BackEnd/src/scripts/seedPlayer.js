// BackEnd/src/scripts/seedPlayer.js
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../db/index.js';
import { Player } from '../models/player.models.js';
import axios from 'axios';

const API_KEY = process.env.CRIC_API_KEY; 
const BASE_URL = process.env.CRICAPI_BASE_URL; 

async function fetchPlayers() {
  try {
    const { data } = await axios.get(`${BASE_URL}/players`, {
      params: { apikey: API_KEY, offset: 0, search: "India" } // you can change 'India' to fetch by country
    });

    if (!data?.data?.length) {
      console.log("[seed] No players returned from API");
      return [];
    }

    // Map API response into your Player schema format
    return data.data.map((p) => ({
      playerId: p.id,
      name: p.name,
      country: p.country,
      role: p.role || "Unknown",
      battingStyle: p.battingStyle || "",
      bowlingStyle: p.bowlingStyle || "",
      dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : null,
      placeOfBirth: p.placeOfBirth || "",
      playerImg: p.playerImg || "",
      stats: [], // You can later enhance this by calling player stats API for each player
    }));
  } catch (err) {
    console.error("[seed] Error fetching players:", err.message);
    return [];
  }
}

async function main() {
  try {
    await connectDB();
    console.log("[seed] DB connected");

    const players = await fetchPlayers();

    if (!players.length) {
      console.log("[seed] No players to insert. Aborting.");
      return;
    }

    const ops = players.map((p) => ({
      updateOne: {
        filter: { playerId: p.playerId },
        update: { $set: p },
        upsert: true,
      },
    }));

    const result = await Player.bulkWrite(ops, { ordered: false });
    console.log("[seed] Done:", {
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount,
    });
  } catch (err) {
    console.error("[seed] Error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("[seed] DB connection closed");
  }
}

main();
