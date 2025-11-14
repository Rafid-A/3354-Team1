import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/brands", brandRoutes);

app.listen(PORT, () => {
  console.log("Server started on port:", PORT);
});
