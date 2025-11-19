import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { checkout } from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/create-checkout-session", isAuthenticated, checkout);

export default router;
