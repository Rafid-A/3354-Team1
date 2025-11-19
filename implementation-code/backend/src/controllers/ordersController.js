import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db/db.js";
import { orders, orderItems, orderShipping, products, productImages } from "../db/schema.js";

export const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.user;

    const orderList = await db
      .select({
        orderId: orders.orderId,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(userId, orders.userId))
      .orderBy(desc(orders.createdAt));

    if (orderList.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const orderIds = orderList.map((o) => o.orderId);

    const allItems = await db
      .select({
        orderId: orderItems.orderId,
        vendorId: orderItems.vendorId,
        productId: orderItems.productId,
        productName: products.name,
        price: products.price,
        quantity: orderItems.quantity,
        shippingStatus: orderItems.shippingStatus,
        imageUrl: productImages.imageUrl,
      })
      .from(orderItems)
      .where(and(inArray(orderItems.orderId, orderIds), eq(productImages.isPrimary, true)))
      .leftJoin(products, eq(orderItems.productId, products.productId))
      .leftJoin(productImages, eq(products.productId, productImages.productId));

    const ordersWithItems = orderList.map((order) => {
      const itemsForOrder = allItems.filter((item) => item.orderId === order.orderId);

      // Group by vendorId
      const groupedByVendor = itemsForOrder.reduce((acc, item) => {
        if (!acc[item.vendorId]) {
          acc[item.vendorId] = [];
        }
        acc[item.vendorId].push(item);
        return acc;
      }, {});

      return {
        ...order,
        items: groupedByVendor,
      };
    });

    return res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error("Error in getAllOrders controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await db
      .select({
        orderId: orders.orderId,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orderId, orders.orderId))
      .limit(1);

    if (order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const allItems = await db
      .select({
        orderId: orderItems.orderId,
        vendorId: orderItems.vendorId,
        productId: orderItems.productId,
        productName: products.name,
        price: products.price,
        quantity: orderItems.quantity,
        shippingStatus: orderItems.shippingStatus,
        imageUrl: productImages.imageUrl,
      })
      .from(orderItems)
      .where(and(eq(orderItems.orderId, orderId), eq(productImages.isPrimary, true)))
      .leftJoin(products, eq(orderItems.productId, products.productId))
      .leftJoin(productImages, eq(products.productId, productImages.productId));

    const groupedByVendor = allItems.reduce((acc, item) => {
      if (!acc[item.vendorId]) acc[item.vendorId] = [];
      acc[item.vendorId].push(item);
      return acc;
    }, {});

    const shippingInfo = await db
      .select()
      .from(orderShipping)
      .where(eq(orderId, orderShipping.orderId))
      .limit(1);

    return res.status(200).json({ ...order[0], items: groupedByVendor, shipping: shippingInfo[0] });
  } catch (error) {
    console.error("Error in getOrderById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
