import express from "express";
import { getUserProfile, login, logout, signup } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", isAuthenticated, getUserProfile);

export default router;
