import express from "express";
import { db } from "../db/db.js";
import { products } from "../db/schema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const brandList = await db
      .selectDistinct({ brand: products.brand })
      .from(products)
      .orderBy(products.brand);

    return res.status(200).json(brandList);
  } catch (error) {
    console.error("Error in getting brands", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
