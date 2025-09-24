// routes/contest.routes.js
import express from "express";
import { joinContest } from "../controllers/contestController.js";
import { endContest } from "../controllers/contestEndController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getLeaderboard } from "../controllers/contestLeaderboardController.js";

const router = express.Router();

router.post("/join", authMiddleware, joinContest);
router.post("/end", endContest); // no auth for now, can restrict to admin later

export default router;
