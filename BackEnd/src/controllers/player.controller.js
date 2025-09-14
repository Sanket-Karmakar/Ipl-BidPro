// src/controllers/player.controller.js
import { Player } from "../models/player.models.js";
import axios from "axios";

// ------------------ Helper ------------------
async function fetchFromCricData(playerName) {
  const { data } = await axios.get(`${process.env.CRICAPI_BASE_URL}/players`, {
    params: {
      apikey: process.env.CRIC_API_KEY,
      search: playerName,
    },
  });

  // CricData returns players in `data.data`
  return data?.data?.length ? data.data[0] : null;
}

// ------------------ Controllers ------------------

// GET /api/players/fetch-stats?name=Virat Kohli
export async function fetchPlayerStatsController(req, res) {
  try {
<<<<<<< HEAD
    const playerName = req.body.name || req.query.name;
    if (!playerName) {
      return res.status(400).json({
        success: false,
        message: "Player name is required in query ?name= or body {name}",
      });
    }

    // 1. Try from DB
    let player = await Player.findOne({ name: new RegExp(playerName, "i") });
    if (player) {
      return res.json({ success: true, source: "db", data: player });
=======
    // ✅ Accept name from either body or query
    const playerName = req.body.name || req.query.name;
    if (!playerName) {
      return res
        .status(400)
        .json({ error: "Player name is required in body or query param `name`." });
    }

    const player = await fetchAndStorePlayerStats(playerName);
    if (!player) {
      return res
        .status(404)
        .json({ error: `No player found for "${playerName}"` });
>>>>>>> 9e219e03b845538a299dbfffb9978743f44048e8
    }

    // 2. Not in DB → fetch from CricData
    const externalPlayer = await fetchFromCricData(playerName);
    if (!externalPlayer) {
      return res.status(404).json({
        success: false,
        message: `No player found for "${playerName}"`,
      });
    }

    // 3. Save to DB
    player = await Player.create({
      playerId: externalPlayer.id,
      name: externalPlayer.name,
      country: externalPlayer.country,
      role: externalPlayer.role,
      battingStyle: externalPlayer.battingStyle,
      bowlingStyle: externalPlayer.bowlingStyle,
      playerImg: externalPlayer.img,
    });

    return res.json({ success: true, source: "api", data: player });
  } catch (error) {
    console.error("❌ Error in fetchPlayerStatsController:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch player stats." });
  }
}

// GET /api/players/:id
export async function getPlayerController(req, res) {
  try {
    const playerId = req.params.id;
    const player = await Player.findOne({ playerId });

    if (!player) {
      return res.status(404).json({ success: false, message: "Player not found in DB." });
    }

    res.json({ success: true, data: player });
  } catch (error) {
    console.error("❌ Error in getPlayerController:", error.message);
    res.status(500).json({ success: false, message: "Failed to get player." });
  }
}
