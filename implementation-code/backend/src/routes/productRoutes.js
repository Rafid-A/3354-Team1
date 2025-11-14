import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import { isAuthenticated, isVendor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

// vendor only
router.post(
  "/",
  isAuthenticated,
  isVendor,
  upload.fields([
    { name: "primaryImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct
);
router.delete("/", deleteProduct);

export default router;
