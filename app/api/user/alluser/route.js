// app/api/user/alluser/route.js
import { NextResponse } from "next/server";
import { connectToDB } from '../../../util/db.js';
import { getUserFromRequest } from "../../../util/auth.js";
import User from "../../../models/User.js";
import bcrypt from "bcryptjs";


//GET → List all users (testing)
export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("GET USERS ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


