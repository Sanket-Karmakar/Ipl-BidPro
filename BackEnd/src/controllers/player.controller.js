// src/controllers/player.controller.js
import { Player } from "../models/player.models.js";
import { generatePlayerBiography } from "../services/aiService.js";
import { fetchAndStorePlayerStats, searchPlayersAPI } from "../services/playerStats.service.js";

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
    let player = await Player.findOne({ playerId });

    if (!player) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found in DB." });
    }

    // --- LAZY LOAD AI BIOGRAPHY (NON-BLOCKING) ---
    // Fire-and-forget: don't block the response while AI generates
    const TOP_25_PLAYERS = [
      "Virat Kohli", "Rohit Sharma", "MS Dhoni", "Jasprit Bumrah", "Suryakumar Yadav",
      "Hardik Pandya", "Ravindra Jadeja", "Shubman Gill", "Rishabh Pant", "KL Rahul",
      "AB de Villiers", "Chris Gayle", "Lasith Malinga", "David Warner", "Rashid Khan",
      "Jos Buttler", "Ben Stokes", "Trent Boult", "Pat Cummins", "Mitchell Starc",
      "Kane Williamson", "Babar Azam", "Shaheen Afridi", "Glenn Maxwell", "Sunil Narine"
    ];

    if (!player.biography && TOP_25_PLAYERS.includes(player.name)) {
        // Non-blocking: generate in background, save to DB, user sees it on next visit
        console.log(`Generating AI Biography for ${player.name} (background)...`);
        generatePlayerBiography(player.name).then(bio => {
            if (bio) {
                Player.findByIdAndUpdate(player._id, { biography: bio }).catch(err => {
                    console.error("Failed to save biography:", err.message);
                });
            }
        });
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

// GET /api/players/search?q=...
export async function searchPlayersController(req, res) {
  try {
    const query = req.query.q;
    if (!query || query.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const suggestions = await searchPlayersAPI(query);
    return res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error("❌ Error in searchPlayersController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search players.",
    });
  }
}

// GET /api/players/by-name/:name
export async function getPlayerByNameController(req, res) {
  try {
    const playerName = decodeURIComponent(req.params.name);
    let player = await Player.findOne({
      name: { $regex: new RegExp(`^${playerName}$`, 'i') }
    });

    // If player exists but is incomplete (no stats or no role), re-fetch from API
    const isIncomplete = player && (!player.stats || player.stats.length === 0 || !player.role);
    if (isIncomplete) {
      console.log(`⚠️ Player "${playerName}" found but data is incomplete — re-fetching...`);
      const refreshed = await fetchAndStorePlayerStats(playerName);
      if (refreshed) {
        player = refreshed;
      }
    }

    if (!player) {
      // Try fetching from API if not in DB at all
      const fetched = await fetchAndStorePlayerStats(playerName);
      if (!fetched) {
        return res
          .status(404)
          .json({ success: false, message: "Player not found in DB." });
      }
      player = fetched;
    }

    // --- LAZY LOAD AI BIOGRAPHY (NON-BLOCKING) ---
    const TOP_25_PLAYERS = [
      "Virat Kohli", "Rohit Sharma", "MS Dhoni", "Jasprit Bumrah", "Suryakumar Yadav",
      "Hardik Pandya", "Ravindra Jadeja", "Shubman Gill", "Rishabh Pant", "KL Rahul",
      "AB de Villiers", "Chris Gayle", "Lasith Malinga", "David Warner", "Rashid Khan",
      "Jos Buttler", "Ben Stokes", "Trent Boult", "Pat Cummins", "Mitchell Starc",
      "Kane Williamson", "Babar Azam", "Shaheen Afridi", "Glenn Maxwell", "Sunil Narine"
    ];

    if (!player.biography && TOP_25_PLAYERS.includes(player.name)) {
      console.log(`Generating AI Biography for ${player.name} (background)...`);
      generatePlayerBiography(player.name).then(bio => {
        if (bio) {
          Player.findByIdAndUpdate(player._id, { biography: bio }).catch(err => {
            console.error("Failed to save biography:", err.message);
          });
        }
      });
    }

    res.json({ success: true, data: player });
  } catch (error) {
    console.error("❌ Error in getPlayerByNameController:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get player.",
    });
  }
}

// GET /api/players/compare?p1=Name1&p2=Name2
export async function comparePlayersController(req, res) {
  try {
    const { p1, p2 } = req.query;
    if (!p1 || !p2) {
      return res.status(400).json({ success: false, message: "Both p1 and p2 query parameters are required." });
    }

    const player1Name = decodeURIComponent(p1);
    const player2Name = decodeURIComponent(p2);

    const getOrFetchPlayer = async (playerName) => {
      let player = await Player.findOne({
        name: { $regex: new RegExp(`^${playerName}$`, 'i') }
      });
      const isIncomplete = player && (!player.stats || player.stats.length === 0 || !player.role);
      if (!player || isIncomplete) {
        const fetched = await fetchAndStorePlayerStats(playerName);
        if (fetched) return fetched;
      }
      return player;
    };

    const [player1, player2] = await Promise.all([
      getOrFetchPlayer(player1Name),
      getOrFetchPlayer(player2Name)
    ]);

    if (!player1 || !player2) {
      return res.status(404).json({ success: false, message: "One or both players not found." });
    }

    res.json({ success: true, data: { player1, player2 } });
  } catch (error) {
    console.error("❌ Error in comparePlayersController:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to compare players.",
    });
  }
}