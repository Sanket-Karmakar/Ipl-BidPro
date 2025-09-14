import express from 'express';
import { fetchPlayerStatsController, getPlayerController } from "../controllers/player.controller.js";

const router = express.Router();

router.get("/fetch-stats", fetchPlayerStatsController);
router.get("/:id", getPlayerController);

export default router;

