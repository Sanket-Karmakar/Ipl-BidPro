import express from "express";
import { createTeam, getUserTeamsByMatch, deleteTeam } from "../controllers/team.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTeam);
router.get("/:matchId", protect, getUserTeamsByMatch);
router.delete("/:teamId", protect, deleteTeam); 

export default router;


