// app/api/files/upload/route.js
import { NextResponse } from "next/server";
import connectToDB from "../../../util/db.js";
import { getUserFromRequest } from "../../../util/auth.js";
import FileModel from "../../../models/File.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";

export async function POST(req) {
  // formData approach
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();

    // parse form data
    const form = await req.formData();
    const file = form.get("file");
    const tagsRaw = form.get("tags") || "";
    const catalogRaw = form.get("catalog") || "false";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // file is a File object (web streams)
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || `upload_${Date.now()}`;
    const ext = path.extname(originalName) || "";
    const filename = `${uuidv4()}${ext}`;

    // ensure upload dir exists
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    const savePath = path.resolve(UPLOAD_DIR, filename);
    fs.writeFileSync(savePath, buffer);

    const tags = tagsRaw ? String(tagsRaw).split(",").map((t) => t.trim()).filter(Boolean) : [];
    const catalog = String(catalogRaw) === "true";

    const doc = await FileModel.create({
      filename,
      originalName,
      owner: user._id,
      size: buffer.length,
      mimetype: file.type,
      tags,
      catalog
    });

    return NextResponse.json({ file: doc }, { status: 201 });
  } catch (err) {
    console.error("UPLOAD ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
