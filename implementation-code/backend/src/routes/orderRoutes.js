import express from "express";
import { isAuthenticated, isVendor } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  getOrderById,
  getAllOrdersForVendor,
  updateShippingStatus,
} from "../controllers/ordersController.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllOrders);
router.get("/vendor", isAuthenticated, isVendor, getAllOrdersForVendor);
router.get("/:id", isAuthenticated, getOrderById);

router.patch("/update-status/:id", isAuthenticated, isVendor, updateShippingStatus);

export default router;
