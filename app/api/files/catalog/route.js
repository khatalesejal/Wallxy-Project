//app/api/files/catalog/route.js
import { NextResponse } from "next/server";
import connectToDB from "../../../util/db.js";
import { getUserFromRequest } from "../../../util/auth.js";
import FileModel from "../../../models/File.js";

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileId, catalog } = await req.json();
    if (!fileId) return NextResponse.json({ error: "fileId required" }, { status: 400 });

    await connectToDB();
    const file = await FileModel.findById(fileId);
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });
    if (file.owner.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    file.catalog = Boolean(catalog);
    await file.save();

    return NextResponse.json({ file });
  } catch (err) {
    console.error("CATALOG ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  // list all files in the catalog (public)
  try {
    await connectToDB();
    const q = new URL(req.url).searchParams;
    const page = parseInt(q.get("page") || "1", 10);
    const limit = parseInt(q.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const files = await FileModel.find({ catalog: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
    const total = await FileModel.countDocuments({ catalog: true });

    return NextResponse.json({ data: files, total, page, limit });
  } catch (err) {
    console.error("CATALOG LIST ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
