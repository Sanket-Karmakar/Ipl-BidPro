import express from "express";
import { joinContest } from "../controllers/contest.controller.js";
import { endContest } from "../controllers/contestEnd.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; 
import { getLeaderboard } from "../controllers/leaderboad.controller.js";

const router = express.Router();

router.post("/join", verifyJWT, joinContest);
router.post("/end", endContest); 

export default router;
