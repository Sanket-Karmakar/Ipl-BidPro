import express from "express";
import { joinContest, getAvailableContests, getUserContests } from "../controllers/contest.controller.js";
import { endContest } from "../controllers/contestEnd.controller.js";
import { getContestLeaderboard, getTeamPointBreakdown, triggerScoring } from "../controllers/leaderboard.controller.js";

const router = express.Router();

// ✅ Routes (no JWT required now)
router.get("/available", getAvailableContests);
router.get("/my-contests", getUserContests);
router.post("/join", joinContest);
router.post("/end", endContest);

// Leaderboard & Scoring
router.get("/:contestId/leaderboard", getContestLeaderboard);
router.get("/:contestId/leaderboard/:teamId/breakdown", getTeamPointBreakdown);
router.post("/:contestId/score", triggerScoring);

export default router;
