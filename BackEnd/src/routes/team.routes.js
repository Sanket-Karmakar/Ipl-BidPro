import express from "express";
import { createTeam, getUserTeamsByMatch, getAllUserTeams, updateTeam, deleteTeam } from "../controllers/team.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/", protect, createTeam);
router.get("/all/my-teams", protect, getAllUserTeams);    // ← must be before :matchId
router.get("/:matchId", protect , getUserTeamsByMatch);
router.put("/:teamId", protect, updateTeam);
router.delete("/:teamId", protect, deleteTeam); 

export default router;
