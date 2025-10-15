// app/api/dashboard/route.js
import { NextResponse } from "next/server";
import connectToDB from "../util/db.js";
import { getUserFromRequest } from "../util/auth.js";
import FileModel from "../models/File.js";
import User from "../models/User.js";

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();
    const uploadsCount = await FileModel.countDocuments({ owner: user._id });
    const catalogCount = await FileModel.countDocuments({ owner: user._id, catalog: true });
    const recentUploads = await FileModel.find({ owner: user._id }).sort({ createdAt: -1 }).limit(5);

    return NextResponse.json({
      user: { id: user._id, username: user.username, email: user.email },
      stats: { uploadsCount, catalogCount, recentUploads }
    });
  } catch (err) {
    console.error("DASHBOARD ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
