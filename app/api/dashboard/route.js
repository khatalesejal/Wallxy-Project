import { NextResponse } from "next/server";
import { connectToDB } from "@/app/util/db.js";
import { getUserFromRequest } from "@/app/util/auth.js";
import File from "@/app/models/File";

export async function GET(req) {
  try {
    // Get the logged-in user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Connect to MongoDB
    await connectToDB();

    //Stats
    const uploadsCount = await File.countDocuments({ owner: user._id });
    const catalogCount = await File.countDocuments({ owner: user._id, catalog: true });

    //Recent uploads (latest 5 files)
    const recentUploads = await File.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("catalogName fileUrl createdAt");

    //Catalogs created by user
    const userCatalogs = await File.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .select("catalogName fileUrl createdAt description tags");
      console.log("user catalogs ",userCatalogs)

    // Response
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
        userCatalogs, 
      },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
