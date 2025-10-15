// app/api/files/history/route.js
import { NextResponse } from "next/server";
import connectToDB from "../../../util/db.js";
import { getUserFromRequest } from "../../../util/auth.js";
import FileModel from "../../../models/File.js";

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectToDB();

    const q = new URL(req.url).searchParams;
    const page = parseInt(q.get("page") || "1", 10);
    const limit = parseInt(q.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const files = await FileModel.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const total = await FileModel.countDocuments({ owner: user._id });

    return NextResponse.json({ data: files, total, page, limit });
  } catch (err) {
    console.error("HISTORY ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
