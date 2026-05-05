import { Match } from "../models/match.models.js";
import { fetchScorecardFromAPI } from "../services/scorecardService.js";
import { fetchBallByBallFromAPI } from "../services/ballByBallService.js";
import axios from "axios";

// Cache TTL: 60s for live matches, 24h for completed
const LIVE_CACHE_TTL_MS = 60 * 1000;       // 60 seconds
const COMPLETED_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * GET /api/matches/:matchId/scorecard
 * Returns cached scorecard if fresh enough, else fetches from CricAPI
 */
export async function getMatchScorecard(req, res) {
    try {
        const { matchId } = req.params;

        // 1. Look up the match
        const match = await Match.findOne({ matchId }).lean();
        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }

        // 2. Determine if cache is fresh enough
        const isLive = match.matchStarted && !match.matchEnded;
        const cacheTTL = isLive ? LIVE_CACHE_TTL_MS : COMPLETED_CACHE_TTL_MS;
        const lastFetched = match.scorecardLastFetched ? new Date(match.scorecardLastFetched).getTime() : 0;
        const cacheAge = Date.now() - lastFetched;
        const isCacheFresh = match.scorecardData && cacheAge < cacheTTL;

        if (isCacheFresh) {
            console.log(`⚡ Serving cached scorecard for ${matchId} (age: ${Math.round(cacheAge / 1000)}s)`);
            return res.json({
                success: true,
                source: "cache",
                matchInfo: {
                    name: match.name,
                    venue: match.venue,
                    date: match.dateTimeGMT,
                    status: match.status,
                    teams: match.teams,
                    teamInfo: match.teamInfo,
                    score: match.score,
                    matchStarted: match.matchStarted,
                    matchEnded: match.matchEnded,
                },
                data: match.scorecardData,
            });
        }

        // 3. Fetch fresh from CricAPI
        const scorecardData = await fetchScorecardFromAPI(matchId);
        if (!scorecardData) {
            // If we have stale cache, return it anyway
            if (match.scorecardData) {
                return res.json({
                    success: true,
                    source: "stale-cache",
                    matchInfo: {
                        name: match.name,
                        venue: match.venue,
                        date: match.dateTimeGMT,
                        status: match.status,
                        teams: match.teams,
                        teamInfo: match.teamInfo,
                        score: match.score,
                        matchStarted: match.matchStarted,
                        matchEnded: match.matchEnded,
                    },
                    data: match.scorecardData,
                });
            }
            
            // Re-fetch match just in case score was updated
            const updatedMatch = await Match.findOne({ matchId }).lean();
            // Return matchInfo even if full scorecard isn't available yet
            return res.status(200).json({ 
                success: true, 
                message: "Scorecard not available yet",
                source: "db-only",
                matchInfo: {
                    name: updatedMatch.name,
                    venue: updatedMatch.venue,
                    date: updatedMatch.dateTimeGMT,
                    status: updatedMatch.status,
                    teams: updatedMatch.teams,
                    teamInfo: updatedMatch.teamInfo,
                    score: updatedMatch.score,
                    matchStarted: updatedMatch.matchStarted,
                    matchEnded: updatedMatch.matchEnded,
                },
                data: null
            });
        }

        // 4. Cache in DB
        await Match.findOneAndUpdate(
            { matchId },
            {
                $set: {
                    scorecardData: scorecardData,
                    scorecardLastFetched: new Date(),
                },
            }
        );

        // Re-fetch match for updated status/score (API might have updated match info)
        const updatedMatch = await Match.findOne({ matchId }).lean();

        return res.json({
            success: true,
            source: "api",
            matchInfo: {
                name: updatedMatch.name,
                venue: updatedMatch.venue,
                date: updatedMatch.dateTimeGMT,
                status: updatedMatch.status,
                teams: updatedMatch.teams,
                teamInfo: updatedMatch.teamInfo,
                score: updatedMatch.score,
                matchStarted: updatedMatch.matchStarted,
                matchEnded: updatedMatch.matchEnded,
            },
            data: scorecardData,
        });
    } catch (error) {
        console.error("❌ Error in getMatchScorecard:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch scorecard", error: error.message });
    }
}

/**
 * GET /api/matches/:matchId/bbb
 * Returns ball-by-ball data from CricAPI (no caching — always near-live)
 */
export async function getMatchBallByBall(req, res) {
    try {
        const { matchId } = req.params;

        // Verify match exists
        const match = await Match.findOne({ matchId }).lean();
        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }

        // Fetch from CricAPI (always fresh for live matches)
        const bbbData = await fetchBallByBallFromAPI(matchId);
        if (!bbbData) {
            return res.status(404).json({ success: false, message: "Ball-by-ball data not available" });
        }

        return res.json({
            success: true,
            matchInfo: {
                name: match.name,
                teams: match.teams,
                teamInfo: match.teamInfo,
                matchStarted: match.matchStarted,
                matchEnded: match.matchEnded,
            },
            data: bbbData,
        });
    } catch (error) {
        console.error("❌ Error in getMatchBallByBall:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch ball-by-ball data", error: error.message });
    }
}

/**
 * GET /api/matches/:matchId/squad
 * Returns match squad (playing XI) from CricAPI
 */
export async function getMatchSquad(req, res) {
    try {
        const { matchId } = req.params;
        const apiKey = process.env.CRIC_API_KEY;
        const response = await axios.get(`https://api.cricapi.com/v1/match_squad?apikey=${apiKey}&id=${matchId}`);
        
        if (response.data && response.data.status === "success") {
            return res.json({ success: true, data: response.data.data });
        } else {
            return res.status(404).json({ success: false, message: "Squad data not available" });
        }
    } catch (error) {
        console.error("❌ Error in getMatchSquad:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch squad data", error: error.message });
    }
}
