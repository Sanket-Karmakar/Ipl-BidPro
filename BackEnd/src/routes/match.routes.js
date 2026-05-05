import express from 'express';
import { getAllMatches, getMatchById, fetchUpcomingMatches, fetchOngoingMatches, fetchCompletedMatches, fetchIpl2026Matches, getMatchPreviewController } from '../controllers/match.controller.js';

const router = express.Router();

router.get('/', getAllMatches);
router.get('/upcoming', fetchUpcomingMatches);
router.get('/completed', fetchCompletedMatches);
router.get('/ongoing', fetchOngoingMatches);
router.get('/series/ipl2026', fetchIpl2026Matches);
router.get('/:id/preview', getMatchPreviewController);
router.get('/:id', getMatchById);

export default router;


