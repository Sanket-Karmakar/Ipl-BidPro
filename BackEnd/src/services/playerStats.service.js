import axios from "axios";
import { Player } from "../models/player.models.js";
import { normalizeCricApiResponse } from "../utils/normalizeStats.js";

// --- Configuration (from .env) ---
const CRICAPI_BASE_URL = process.env.CRICAPI_BASE_URL || "https://api.cricapi.com/v1";
const CRICAPI_KEY = process.env.CRIC_API_KEY; // single key for both search & info

export async function fetchAndStorePlayerStats(playerName) {
    if (!playerName) {
        console.error("❌ Player name cannot be empty.");
        return null;
    }

    try {
        // --- Step 1: Search player by name to get CricAPI ID ---
        const searchUrl = `${CRICAPI_BASE_URL}/players?apikey=${CRICAPI_KEY}&offset=0&search=${encodeURIComponent(playerName)}`;
        

        const cricApiPlayerId = searchResponse.data.data[0].id;
        console.log(`✅ Found CricAPI ID for ${playerName}: ${cricApiPlayerId}`);

        // --- Step 2: Fetch detailed player info ---
        const playerInfoUrl = `${CRICAPI_BASE_URL}/players_info?apikey=${CRICAPI_KEY}&id=${cricApiPlayerId}`;
        const playerInfoResponse = await axios.get(playerInfoUrl);

        if (playerInfoResponse.data.status !== "success" || !playerInfoResponse.data.data) {
            console.error(`Failed to fetch player info for ID ${cricApiPlayerId}`, playerInfoResponse.data);
            return null;
        }

        const rawPlayerInfo = playerInfoResponse.data.data;

        // --- Step 3: Normalize stats ---
        const normalizedPlayerData = normalizeCricApiResponse(rawPlayerInfo);
        if (!normalizedPlayerData) {
            console.error(`Normalization failed for player: ${playerName}`);
            return null;
        }

        // --- Step 4: Upsert into MongoDB ---
        const player = await Player.findOneAndUpdate(
            { playerId: normalizedPlayerData.playerId },
            normalizedPlayerData,
            { new: true, upsert: true, runValidators: true }
        );

        console.log(`Successfully saved/updated player: ${player.name}`);
        return player;

    } catch (error) {
        console.error(`Error fetching/storing player "${playerName}":`, error.message);
        if (error.response) {
            console.error("CricAPI Error Response Data:", error.response.data);
            console.error("CricAPI Error Response Status:", error.response.status);
        }
        return null;
    }
}