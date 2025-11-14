import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { categories, productImages, products, vendors } from "../db/schema.js";
import uploadFile from "../utils/imageUpload.js";

export const getAllProducts = async (req, res) => {
  try {
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
      .where(eq(productImages.isPrimary, true))
      .leftJoin(vendors, eq(products.vendorId, vendors.vendorId))
      .leftJoin(categories, eq(products.categoryId, categories.categoryId))
      .leftJoin(productImages, eq(products.productId, productImages.productId))
      .orderBy(desc(products.createdAt));

    if (productsList.length == 0) {
      return res.status(400).json({ message: "No product found" });
    }

    const formattedProducts = productsList.map((p) => ({
      ...p,
      price: parseFloat(p.price),
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error in getAllProducts controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

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
      })
      .from(products)
      .where(eq(products.productId, productId))
      .leftJoin(vendors, eq(products.vendorId, vendors.vendorId))
      .leftJoin(categories, eq(products.categoryId, categories.categoryId));

    const images = await db
      .select({
        imageId: productImages.imageId,
        imageUrl: productImages.imageUrl,
      })
      .from(productImages)
      .where(eq(productId, productImages.productId));

    if (productsList.length == 0) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const productInfo = { ...productsList[0], images };

    const formattedProducts = {
      ...productInfo,
      price: parseFloat(productInfo.price),
    };

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error in getProductById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { category, name, brand, description, price, stockQuantity } = req.body;

    const { vendorId } = req.vendor;

    const categoryList = await db
      .select({ categoryId: categories.categoryId })
      .from(categories)
      .where(eq(category.toLowerCase(), categories.name));

    if (categoryList.length === 0) return res.status(400).json({ message: "Invalid category" });

    const categoryId = categoryList[0].categoryId;

    const result = await db
      .insert(products)
      .values({
        vendorId,
        categoryId,
        name,
        brand,
        description,
        price,
        stockQuantity,
      })
      .returning({ productId: products.productId });

    const productId = result[0].productId;

    let primaryImageUrl = "";

    if (req.files?.primaryImage[0]) {
      try {
        primaryImageUrl = await uploadFile(req.files.primaryImage[0].path);
      } catch (error) {
        console.error("Error in uploading images", error);
        return res.status(400).json({ message: "Error in uploading the images" });
      }

      await db.insert(productImages).values({
        productId,
        imageUrl: primaryImageUrl,
        isPrimary: true,
      });
    }

    let imageUrls = {};

    if (req.files?.images?.length > 0) {
      try {
        const uploadPromises = req.files.images.map((file) => uploadFile(file.path));
        imageUrls = await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error in uploading images", error);
        return res.status(400).json({ message: "Error in uploading the images" });
      }

      await db.insert(productImages).values(
        imageUrls.map((url) => ({
          productId,
          imageUrl: url,
        }))
      );
    }

    return res.status(201).json({ productId });
  } catch (error) {
    console.error("Error in createProduct controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error in deleteProduct controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
