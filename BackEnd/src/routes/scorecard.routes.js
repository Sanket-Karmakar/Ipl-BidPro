import express from "express";
import { getMatchScorecard, getMatchBallByBall, getMatchSquad } from "../controllers/scorecard.controller.js";

const router = express.Router();

// GET /api/matches/:matchId/scorecard
router.get("/:matchId/scorecard", getMatchScorecard);

// GET /api/matches/:matchId/bbb
router.get("/:matchId/bbb", getMatchBallByBall);

// GET /api/matches/:matchId/squad
router.get("/:matchId/squad", getMatchSquad);

export default router;
