import express from 'express';
import { getAllMatches, getMatchById, fetchUpcomingMatches, fetchOngoingMatches, fetchCompletedMatches } from '../controllers/match.controller.js';

const router = express.Router();

router.get('/', getAllMatches);
router.get('/upcoming', fetchUpcomingMatches);
router.get('/completed', fetchCompletedMatches);
router.get('/ongoing', fetchOngoingMatches);
router.get('/:id', getMatchById);

export default router;
