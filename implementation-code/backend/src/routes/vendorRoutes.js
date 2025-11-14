import express from "express";
import {
  getAllVendors,
  getVendorById,
  getVendorProducts,
  registerVendor,
} from "../controllers/vendorController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllVendors);
router.get("/:id", getVendorById);
router.get("/:id/products", getVendorProducts);
router.post("/register", isAuthenticated, registerVendor);

export default router;
