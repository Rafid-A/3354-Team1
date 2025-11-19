import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { getAllOrders, getOrderById } from "../controllers/ordersController.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllOrders);
router.get("/:id", isAuthenticated, getOrderById);

export default router;
