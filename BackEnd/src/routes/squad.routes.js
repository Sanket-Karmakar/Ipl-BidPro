import express from 'express';
import { getSquadsByMatchId } from "../controllers/squad.controller.js";

const router = express.Router();

router.get("/matches/:matchId/squads", getSquadsByMatchId);

export default router;

