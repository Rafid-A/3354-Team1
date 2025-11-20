import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users, vendors } from "../db/schema.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length != 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const result = await db
      .insert(users)
      .values({ name: name, email: email, password: hashedPassword })
      .returning({ userId: users.userId });

    const userId = result[0].userId;

    const token = generateToken(userId, res);

    res.status(201).json({
      userId: userId,
      name: name,
      jwt: token,
    });
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length == 0) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!(await comparePassword(password, user[0].password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user[0].userId, res);

    res.status(200).json({
      userId: user[0].userId,
      name: user[0].name,
      jwt: token,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const userList = await db
      .select({ email: users.email, name: users.name, userId: users.userId, role: users.role })
      .from(users)
      .where(eq(userId, users.userId));

    if (userList.length == 0) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }

    if (userList[0].role === "vendor") {
      const vendor = await db
        .select({ vendorId: vendors.vendorId })
        .from(vendors)
        .where(eq(userId, vendors.userId));

      userList[0] = { ...userList[0], vendorId: vendor[0].vendorId };
    }

    res.status(200).json(userList[0]);
  } catch (error) {
    console.error("Error in getUserProfile controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
