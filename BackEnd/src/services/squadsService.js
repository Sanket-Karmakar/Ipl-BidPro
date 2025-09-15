// src/services/squadsService.js

import axios from "axios";
import { Match } from "../models/match.models.js";

/**
 * Get squads for a match:
 * - if they exist in DB, return them (unless forceRefresh = true)
 * - otherwise fetch from CricAPI, save, and return
 */
export const getOrFetchSquads = async (matchId, forceRefresh = false) => {
  // 1. Check DB (skip if forceRefresh true)
  if (!forceRefresh) {
    const match = await Match.findOne(
      { matchId },
      { squads: 1, hasSquad: 1 }
    ).lean();

    if (match && match.squads && match.squads.length > 0) {
      return match.squads; // ✅ serve from DB
    }
  }

  // 2. Fetch from CricAPI
  try {
    const { data } = await axios.get(
      `${process.env.CRICAPI_BASE_URL}/match_squad`,
      {
        params: { apikey: process.env.CRIC_API_KEY, id: matchId }
      }
    );

    if (!data || !data.data) {
      throw new Error("No squads returned from CricAPI");
    }

    // 3. Map API response into schema format
    const squads = data.data.map((team) => ({
      teamName: team.teamName,
      shortname: team.shortname,
      img: team.img,
      players: (team.players || []).map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        battingStyle: p.battingStyle,
        bowlingStyle: p.bowlingStyle,
        country: p.country,
        playerImg: p.playerImg,
      })),
    }));

    // 4. Save squads to DB
    await Match.findOneAndUpdate(
      { matchId },
      { $set: { squads, hasSquad: true } },
      { new: true }
    );

    return squads; // ✅ return fresh squads
  } catch (err) {
    console.error(`Error fetching squads from CricAPI: ${err.message}`);
    throw err;
  }
};

/**
 * Refresh squads for all matches that:
 * - already have squads
 * - are not ended
 * Runs via scheduler (e.g. every 6h)
 */
export const refreshSquads = async () => {
  const matches = await Match.find(
    { hasSquad: true, matchEnded: false },
    { matchId: 1 }
  ).lean();

  console.log(`Refreshing squads for ${matches.length} matches...`);

  for (const m of matches) {
    try {
      await getOrFetchSquads(m.matchId, true); // force refresh
      console.log(`✅ Squads refreshed for match ${m.matchId}`);
    } catch (err) {
      console.error(`❌ Failed to refresh squads for ${m.matchId}: ${err.message}`);
    }
  }
};
