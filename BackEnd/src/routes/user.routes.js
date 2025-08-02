import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.get('/me', verifyJWT, (req, res) => {
    res.status(200).json({
        success: true,
        message: "User fetched successfully!",
        user: req.user
    });
});

export default router;

