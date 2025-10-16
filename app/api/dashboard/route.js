// app/api/dashboard/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/util/db.js";
import { getUserFromRequest } from "@/app/util/auth.js";
import File from "@/app/models/File";

export async function GET(req) {
    console.log("hello user");
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const uploadsCount = await File.countDocuments({ owner: user._id });
    const catalogCount = await File.countDocuments({
      owner: user._id,
      catalog: true,
    });
    const recentUploads = await File.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name url createdAt");

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      stats: {
        uploadsCount,
        catalogCount,
        recentUploads,
      },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
