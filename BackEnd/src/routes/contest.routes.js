// routes/contest.routes.js
import express from "express";
import { joinContest, getAvailableContests, getUserContests } from "../controllers/contest.controller.js";
import { endContest } from "../controllers/contestEnd.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";

const router = express.Router();

// ✅ New routes
router.get("/available", getAvailableContests);
router.get("/my-contests", protect, getUserContests);

// ✅ Existing routes
router.post("/join", protect, joinContest);
router.post("/end", endContest);

router.get("/test", (req, res) => {
  res.json({ message: "Contest route is working!" });
});

console.log("Contest routes loaded!");
export default router;
