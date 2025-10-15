// app/api/user/register/route.js
import connectToDB from "../../../util/db.js";
import User from "../../../models/User.js";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password } = body;
    if (!username || !email || !password) {
      return NextResponse.json({ error: "username, email and password are required" }, { status: 400 });
    }

    await connectToDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email: email.toLowerCase(), password: hashed });
    const safeUser = { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt };

    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err) {
    console.error("REGISTER ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
