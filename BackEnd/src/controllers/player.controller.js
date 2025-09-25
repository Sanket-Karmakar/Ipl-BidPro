// src/controllers/player.controller.js
import { Player } from "../models/player.models.js";
import { fetchAndStorePlayerStats } from "../services/playerStats.service.js";

// POST /api/players/fetch-stats
export async function fetchPlayerStatsController(req, res) {
  try {
    const playerName = req.body.name || req.query.name;
    if (!playerName) {
      return res.status(400).json({
        error: "Player name is required in body or query param `name`.",
      });
    }

    const player = await fetchAndStorePlayerStats(playerName);

    if (!player) {
      return res.status(404).json({
        error: `No player found for "${playerName}"`,
      });
    }

    return res.json({ success: true, source: "db/api", data: player });
  } catch (error) {
    console.error("❌ Error in fetchPlayerStatsController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch player stats.",
      details: error.message,
    });
  }
}

// GET /api/players/:id
export async function getPlayerController(req, res) {
  try {
    const playerId = req.params.id;
    const player = await Player.findOne({ playerId });

    if (!player) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found in DB." });
    }
    res.json({ success: true, data: player });
  } catch (error) {
    console.error("❌ Error in getPlayerController:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get player.",
    });
  }
}