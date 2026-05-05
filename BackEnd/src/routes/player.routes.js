import express from 'express';
import { fetchPlayerStatsController, getPlayerController, getPlayerByNameController, searchPlayersController, comparePlayersController } from "../controllers/player.controller.js";

const router = express.Router();

router.get("/search", searchPlayersController);
router.get("/fetch-stats", fetchPlayerStatsController);
router.get("/compare", comparePlayersController);
router.get("/by-name/:name", getPlayerByNameController);
router.get("/:id", getPlayerController);

export default router;

