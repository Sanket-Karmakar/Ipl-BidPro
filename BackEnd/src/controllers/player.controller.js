import { fetchAndStorePlayerStats } from "../services/playerStats.service.js";
import { Player } from "../models/player.models.js";

export async function fetchPlayerStatsController(req, res) {
  try {
    const playerName = req.query.name;
    if (!playerName) {
      return res.status(400).json({ error: "Player name is required in query param `name`." });
    }

    const player = await fetchAndStorePlayerStats(playerName);
    if (!player) {
      return res.status(404).json({ error: `No player found for "${playerName}"` });
    }

    res.json(player);
  } catch (error) {
    console.error("❌ Error in fetchPlayerStatsController:", error.message);
    res.status(500).json({ error: "Failed to fetch player stats." });
  }
}

export async function getPlayerController(req, res) {
  try {
    const playerId = req.params.id;
    const player = await Player.findOne({ playerId });

    if (!player) {
      return res.status(404).json({ error: "Player not found in DB." });
    }

    res.json(player);
  } catch (error) {
    console.error("❌ Error in getPlayerController:", error.message);
    res.status(500).json({ error: "Failed to get player." });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 8970d6398f5b235d62f1f37d4f78b60eb448430e
