// routes/contest.routes.js
import express from "express";
import { joinContest } from "../controllers/contest.controller.js";
import { endContest } from "../controllers/contestEnd.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.post("/join", protect, joinContest);
router.post("/end", endContest); 

export default router;