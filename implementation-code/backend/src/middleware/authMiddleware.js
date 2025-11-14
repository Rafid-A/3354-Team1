import jwt from "jsonwebtoken";
import { db } from "../db/db.js";
import { users, vendors } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized Request" });
        }

        req.user = user;

        next();
      });
    } else {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
  } catch (error) {
    console.error("Error in isAuthenticated middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const isVendor = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const userList = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(userId, users.userId));

    if (userList.length != 0 && userList[0].role === "vendor") {
      const vendorList = await db
        .select({ vendorId: vendors.vendorId })
        .from(vendors)
        .where(eq(userId, vendors.vendorId));

      req.vendor = vendorList[0];

      next();
    } else {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
  } catch (error) {
    console.error("Error in isAdmin middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
