import express from "express";
import { db } from "../db/db.js";
import { categories } from "../db/schema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categoryList = await db
      .select()
      .from(categories)
      .orderBy(categories.name);

    return res.status(200).json(categoryList);
  } catch (error) {
    console.error("Error in getting categories", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
