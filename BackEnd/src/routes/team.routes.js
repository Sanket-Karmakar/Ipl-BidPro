// src/routes/team.routes.js
import express from "express";
import { createTeam, getTeamsByMatch } from "../controllers/team.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/", verifyJWT, createTeam);
router.get("/:matchId", verifyJWT, getTeamsByMatch);

export default router;
