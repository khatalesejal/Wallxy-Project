// app/util/auth.js
import jwt from "jsonwebtoken";
import connectToDB from "./db.js";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function getUserFromRequest(req) {
  // read Authorization header: "Bearer <token>"
  const auth = req.headers.get?.("authorization") || req.headers?.authorization || null;
  if (!auth) return null;
  const parts = auth.split(" ");
  if (parts.length !== 2) return null;
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    await connectToDB();
    const user = await User.findById(payload.id).select("-password");
    return user || null;
  } catch (err) {
    return null;
  }
}
