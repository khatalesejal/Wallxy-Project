// app/api/files/shared/[token]/route.js
import { NextResponse } from "next/server";
import connectToDB from "../../../../util/db.js";
import FileModel from "../../../../models/File.js";
import jwt from "jsonwebtoken";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";

export async function GET(req, { params }) {
  try {
    const { token } = params;
    if (!token) return NextResponse.json({ error: "Token missing" }, { status: 400 });

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.fileId) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    await connectToDB();
    const file = await FileModel.findById(payload.fileId).populate("owner", "username email");
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

    // ensure this token's email is in sharedWith OR token owner is allowed
    // (token contains allowed email)
    if (payload.email && !file.sharedWith.includes(payload.email)) {
      return NextResponse.json({ error: "Token not authorized for this file" }, { status: 403 });
    }

    const filePath = path.resolve(UPLOAD_DIR, file.filename);
    // Serve metadata + direct URL path to file; you can also stream file bytes if desired.
    const fileUrl = `/uploads/${file.filename}`;

    return NextResponse.json({
      file: {
        id: file._id,
        originalName: file.originalName,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        owner: file.owner,
        fileUrl,
        createdAt: file.createdAt
      }
    });
  } catch (err) {
    console.error("SHARED VIEW ERR", err);
    if (err.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Share token expired" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
