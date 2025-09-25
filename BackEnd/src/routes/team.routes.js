import express from "express";
import { createTeam, getUserTeamsByMatch, updateTeam, deleteTeam } from "../controllers/team.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/", protect, createTeam);
router.get("/:matchId", protect , getUserTeamsByMatch);
router.put("/:teamId", protect, updateTeam);
router.delete("/:teamId", protect, deleteTeam); 

export default router;
