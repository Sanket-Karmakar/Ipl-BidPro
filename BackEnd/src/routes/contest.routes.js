import express from "express";
import { joinContest, getAvailableContests, getUserContests } from "../controllers/contest.controller.js";
import { endContest } from "../controllers/contestEnd.controller.js";

const router = express.Router();

// ✅ Routes (no JWT required now)
router.get("/available", getAvailableContests);
router.get("/my-contests", getUserContests);
router.post("/join", joinContest);
router.post("/end", endContest);

export default router;
