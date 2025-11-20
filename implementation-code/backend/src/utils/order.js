import { db } from "../db/db.js";
import { orderItems, orders, orderShipping } from "../db/schema.js";

export const createOrder = async (stripeSessionId, userId, items, totalAmount, shippingInfo) => {
  const [result] = await db
    .insert(orders)
    .values({ userId, stripeSessionId, totalAmount: totalAmount / 100 })
    .returning({ orderId: orders.orderId });

  for (const item of items) {
    await db.insert(orderItems).values({
      orderId: result.orderId,
      vendorId: item.vendorId,
      productId: item.productId,
      quantity: item.quantity,
    });
  }

  await db.insert(orderShipping).values({
    orderId: result.orderId,
    name: shippingInfo.name,
    addressLine1: shippingInfo.line1,
    addressLine2: shippingInfo.line2,
    city: shippingInfo.city,
    state: shippingInfo.state,
    country: shippingInfo.country,
    postalCode: shippingInfo.postalCode,
  });
};
