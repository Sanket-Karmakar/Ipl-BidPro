import dotenv from 'dotenv';
import axios from "axios";
import { Player } from "../models/player.models.js";
import { normalizeCricApiResponse } from "../utils/normalizeStats.js";

dotenv.config()

console.log("DEBUG ENV CRIC_API_KEY =", process.env.CRIC_API_KEY);

// --- Configuration (from .env) ---
const CRICAPI_BASE_URL = process.env.CRICAPI_BASE_URL || "https://api.cricapi.com/v1";
const CRICAPI_KEY = process.env.CRIC_API_KEY; // single key for both search & info

export async function fetchAndStorePlayerStats(playerName) {
    if (!playerName) {
        console.error("❌ Player name cannot be empty.");
        return null;
    }

    try {
        // --- Step 0: Check if player already exists in our DB (FAST PATH) ---
        const existingPlayer = await Player.findOne({
            name: { $regex: new RegExp(`^${playerName.trim()}$`, 'i') }
        });

        // Only skip API call if the player has complete data (stats + role populated)
        const isComplete = existingPlayer && 
            existingPlayer.stats && existingPlayer.stats.length > 0 && 
            existingPlayer.role;

        if (isComplete) {
            console.log(`⚡ Found "${playerName}" in local DB with complete data — skipping CricAPI calls.`);
            return existingPlayer;
        }

        if (existingPlayer) {
            console.log(`⚠️ Found "${playerName}" in DB but data is incomplete — re-fetching from API...`);
        }

        // --- Step 1: Search player by name to get CricAPI ID ---
        const searchUrl = `${CRICAPI_BASE_URL}/players?apikey=${CRICAPI_KEY}&offset=0&search=${playerName.trim()}`;
        console.log("🟢 DEBUG: Search URL:", searchUrl);

        const searchResponse = await axios.get(searchUrl);

        const { status, data: resultData, reason } = searchResponse.data;

        if (status !== "success" || !resultData || (Array.isArray(resultData) && resultData.length === 0)) {
            console.warn(`⚠️ Search failed for "${playerName}" → reason: ${reason || "no data"}`);
            return null;
        }

        // Handle both array and object responses
        const playerEntry = Array.isArray(resultData) ? resultData[0] : resultData;
        const cricApiPlayerId = playerEntry.id;

        console.log(`✅ Found CricAPI ID for ${playerName}: ${cricApiPlayerId}`);

        // --- Step 2: Fetch detailed player info ---
        const playerInfoUrl = `${CRICAPI_BASE_URL}/players_info?apikey=${CRICAPI_KEY}&offset=0&id=${cricApiPlayerId}`;
        console.log("🟢 DEBUG: Player Info URL:", playerInfoUrl);

        const playerInfoResponse = await axios.get(playerInfoUrl);

        const { status: infoStatus, data: infoData, reason: infoReason } = playerInfoResponse.data;

        if (infoStatus !== "success" || !infoData) {
            console.error(`❌ Failed to fetch player info for ID ${cricApiPlayerId} → reason: ${infoReason || "no data"}`);
            return null;
        }

        // Handle both array and object formats
        const rawPlayerInfo = Array.isArray(infoData) ? infoData[0] : infoData;

        // --- Step 3: Normalize stats ---
        const normalizedPlayerData = normalizeCricApiResponse(rawPlayerInfo);
        if (!normalizedPlayerData) {
            console.error(`❌ Normalization failed for player: ${playerName}`);
            return null;
        }

        // --- Step 4: Upsert into MongoDB ---
        const player = await Player.findOneAndUpdate(
            { playerId: normalizedPlayerData.playerId },
            normalizedPlayerData,
            { new: true, upsert: true, runValidators: true }
        );

        console.log(`🎉 Successfully saved/updated player: ${player.name}`);
        return player;

    } catch (error) {
        console.error(`💥 Error fetching/storing player "${playerName}":`, error.message);

        if (error.response) {
            console.error("🛑 CricAPI Error Response Data:", error.response.data);
            console.error("🛑 CricAPI Error Response Status:", error.response.status);
        } else if (error.request) {
            console.error("🛑 CricAPI no response received:", error.request);
        } else {
            console.error("🛑 CricAPI setup error:", error.message);
        }

        return null;
    }
}

export async function searchPlayersAPI(query) {
    if (!query) return [];

    try {
        // --- FAST PATH: Check local DB first ---
        const localResults = await Player.find(
            { name: { $regex: query, $options: 'i' } },
            { name: 1, country: 1, playerId: 1, playerImg: 1 }
        ).limit(10).lean();

        if (localResults.length > 0) {
            console.log(`⚡ Found ${localResults.length} local suggestions for "${query}"`);
            return localResults.map(p => ({
                id: p.playerId,
                name: p.name,
                country: p.country,
                playerImg: p.playerImg || ''
            }));
        }

        // --- SLOW PATH: Fallback to CricAPI if nothing in DB ---
        const searchUrl = `${CRICAPI_BASE_URL}/players?apikey=${CRICAPI_KEY}&offset=0&search=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchUrl);
        const { status, data: resultData } = searchResponse.data;

        if (status !== "success" || !resultData) {
            return [];
        }

        // Return first 10 suggestions max
        const results = Array.isArray(resultData) ? resultData : [resultData];
        return results.slice(0, 10).map(p => ({
            id: p.id,
            name: p.name,
            country: p.country
        }));
    } catch (error) {
        console.error("Error in searchPlayersAPI:", error.message);
        return [];
    }
}
