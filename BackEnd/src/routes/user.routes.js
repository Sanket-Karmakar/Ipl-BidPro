import express from 'express';
import { protect } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.get('/me', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: "User fetched successfully!",
        user: req.user
    });
});

export default router;

