// app/api/user/login/route.js
import connectToDB from "../../../util/db.js";
import User from "../../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const safeUser = { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt };
    return NextResponse.json({ token, user: safeUser });
  } catch (err) {
    console.error("LOGIN ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
