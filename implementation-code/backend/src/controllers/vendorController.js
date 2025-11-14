import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { vendors, users, products, categories, productImages } from "../db/schema.js";

export const getAllVendors = async (req, res) => {
  try {
    const vendorList = await db
      .select({
        vendorId: vendors.vendorId,
        storeName: vendors.storeName,
        description: vendors.description,
        storeImageUrl: vendors.storeImageUrl,
        email: users.email,
      })
      .from(vendors)
      .leftJoin(users, eq(vendors.userId, users.userId));

    if (vendorList.length == 0) {
      return res.status(400).json({ message: "No vendors found" });
    }

    res.status(200).json(vendorList);
  } catch (error) {
    console.error("Error in getAllVendors controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendorList = await db
      .select({
        vendorId: vendors.vendorId,
        storeName: vendors.storeName,
        description: vendors.description,
        storeImageUrl: vendors.storeImageUrl,
        email: users.email,
      })
      .from(vendors)
      .where(eq(vendors.vendorId, vendorId))
      .leftJoin(users, eq(vendors.userId, users.userId));

    if (vendorList.length == 0) {
      return res.status(400).json({ message: "Invalid vendor id" });
    }

    res.status(200).json(vendorList[0]);
  } catch (error) {
    console.error("Error in getVendorById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const productsList = await db
      .select({
        productId: products.productId,
        productName: products.name,
        description: products.description,
        brand: products.brand,
        price: products.price,
        stockQuantity: products.stockQuantity,
        vendorId: products.vendorId,
        storeName: vendors.storeName,
        categoryId: products.categoryId,
        categoryName: categories.name,
        imageUrl: productImages.imageUrl,
      })
      .from(products)
      .where(and(eq(products.vendorId, vendorId), eq(productImages.isPrimary, true)))
      .leftJoin(vendors, eq(products.vendorId, vendors.vendorId))
      .leftJoin(categories, eq(products.categoryId, categories.categoryId))
      .leftJoin(productImages, eq(products.productId, productImages.productId))
      .orderBy(desc(products.createdAt));

    if (productsList.length == 0) {
      return res.status(400).json({ message: "No products found" });
    }

    const formattedProducts = productsList.map((p) => ({
      ...p,
      price: parseFloat(p.price),
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error in getVendorProducts controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const registerVendor = async (req, res) => {
  try {
    const { userId, storeName, description } = req.body;

    const result = await db
      .insert(vendors)
      .values({ userId, storeName, description })
      .returning({ vendorId: vendors.vendorId });

    await db.update(users).set({ role: "vendor" }).where(eq(users.userId, userId));

    return res.status(201).json({ vendorId: result[0].vendorId });
  } catch (error) {
    console.error("Error in registerVendor controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
