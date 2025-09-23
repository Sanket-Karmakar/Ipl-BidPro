import express from "express";
import { registerUser, loginUser, refreshAccessToken } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middlewares.js";

const router = express.Router();

// register route with image upload
router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

export default router;
