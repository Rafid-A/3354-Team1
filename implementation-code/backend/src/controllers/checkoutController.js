import Stripe from "stripe";
import { createOrder } from "../utils/order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const checkout = async (req, res) => {
  try {
    const { products } = req.body;
    const { userId } = req.user;

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.productName,
          images: [product.imageUrl || product?.images[0]?.imageUrl],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        userId: userId,
        items: JSON.stringify(
          products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            vendorId: p.vendorId,
          }))
        ),
      },
      automatic_tax: {
        enabled: true,
      },
      success_url: "http://localhost:5173/checkout/success",
      cancel_url: "http://localhost:5173/checkout/failure",
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error("Error in checkout controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const stripeWebhook = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (error) {
      console.error("Webhook signature verification failed", error);
      return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const shippingDetails = session.collected_information.shipping_details.address;

      const userId = session.metadata.userId;
      const orderedProducts = JSON.parse(session.metadata.items);

      const shippingInfo = {
        name: session.collected_information.shipping_details.name,
        line1: shippingDetails.line1,
        line2: shippingDetails.line2,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postalCode: shippingDetails.postal_code,
        country: shippingDetails.country,
      };

      createOrder(session.id, userId, orderedProducts, session.amount_total, shippingInfo);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error in checkout controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
