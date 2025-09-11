import express from 'express';
import { fetchPlayerStatsController, getPlayerController } from "../controllers/player.controller.js";

const router = express.Router();

router.post("/fetch-stats", fetchPlayerStatsController);
router.get("/:id", getPlayerController);

<<<<<<< HEAD
export default router;
=======
export default router;

>>>>>>> 8970d6398f5b235d62f1f37d4f78b60eb448430e
