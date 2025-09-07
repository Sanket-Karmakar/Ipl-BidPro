import express from 'express';
import { getAllMatches, getMatchById } from '../controllers/match.controller.js';

const router = express.Router();

router.get('/', getAllMatches);
router.get('/:id', getMatchById);

<<<<<<< HEAD
export default router;
=======
export default router;

>>>>>>> 220e5f4d48593a812bc7f2e44f66c816b4ef1d6b
