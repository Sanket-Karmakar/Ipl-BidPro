import express from 'express';
import { fetchPlayerStatsController, getPlayerController } from "../controllers/player.controller.js";

const router = express.Router();

router.post("/fetch-stats", fetchPlayerStatsController);
router.get("/:id", getPlayerController);

export default router;

