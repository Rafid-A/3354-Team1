import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["customer", "vendor", "admin"]);

export const users = table("users", {
  userId: t.serial("user_id").primaryKey(),
  name: t.varchar("name", { length: 256 }).notNull(),
  email: t.varchar("email", { length: 256 }).notNull().unique(),
  password: t.text().notNull(),
  role: userRoleEnum("role").default("customer"),
});

export const vendors = table("vendors", {
  vendorId: t.serial("vendor_id").primaryKey(),
  userId: t
    .integer("user_id")
    .references(() => users.userId)
    .notNull(),
  storeName: t.varchar("store_name", { length: 256 }).notNull(),
  storeImageUrl: t
    .text("image_url")
    .default("https://res.cloudinary.com/dcksuxdd1/image/upload/v1763014297/techHaven_n0ic59.jpg"),
  description: t.text("description"),
});

export const categories = table("categories", {
  categoryId: t.serial("category_id").primaryKey(),
  name: t.varchar("name", { length: 100 }).notNull().unique(),
  description: t.text("description"),
});

export const products = table("products", {
  productId: t.uuid("product_id").defaultRandom().primaryKey(),
  vendorId: t.integer("vendor_id").references(() => vendors.vendorId),
  categoryId: t.integer("category_id").references(() => categories.categoryId),
  name: t.varchar("name", { length: 300 }).notNull(),
  brand: t.varchar("brand", { length: 150 }).default("Generic"),
  description: t.text("description"),
  price: t.decimal("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: t.integer("stock_quantity").default(0),
  createdAt: t.timestamp("created_at").defaultNow(),
});

export const productImages = table("product_images", {
  imageId: t.serial("image_id").primaryKey(),
  productId: t.uuid("product_id").references(() => products.productId),
  imageUrl: t.text("image_url").notNull(),
  isPrimary: t.boolean("is_primary").default(false),
});

export const orders = table("orders", {
  orderId: t.serial("order_id").primaryKey(),
  userId: t.integer("user_id").references(() => users.userId),
  stripeSessionId: t.text("stripe_session_id").notNull().unique(),
  status: t.varchar("status", { length: 20 }).notNull().default("paid"),
  totalAmount: t.numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = table("order_items", {
  orderItemId: t.serial("order_item_id").primaryKey(),
  orderId: t.integer("order_id").references(() => orders.orderId),
  vendorId: t.integer("vendor_id").references(() => vendors.vendorId),
  productId: t.uuid("product_id").references(() => products.productId),
  quantity: t.integer("quantity").notNull(),
  shippingStatus: t.text("shippingStatus").default("Processing"),
});

export const orderShipping = table("order_shipping", {
  shippingId: t.serial("shipping_id").primaryKey(),
  orderId: t.integer("order_id").references(() => orders.orderId),
  name: t.text("name"),
  addressLine1: t.text("address_line1"),
  addressLine2: t.text("address_line2"),
  city: t.text("city"),
  state: t.text("state"),
  country: t.text("country"),
  postalCode: t.text("postal_code"),
});
