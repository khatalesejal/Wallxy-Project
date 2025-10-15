// app/api/files/crud/route.js

import { NextResponse } from "next/server";
import connectToDB from "../../../util/db.js";
import { getUserFromRequest } from "../../../util/auth.js";
import FileModel from "../../../models/File.js";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";

//GET → List user files 
export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();
    const files = await FileModel.find({ owner: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ files });
  } catch (err) {
    console.error("GET FILES ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//POST → Create file metadata
export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { catalogName, filename, size, mimetype, tags, catalog } = body;

    if (!catalogName || !filename) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();
    const file = await FileModel.create({
      catalogName,
      filename,
      owner: user._id,
      size: size || 0,
      mimetype: mimetype || "",
      tags: tags || [],
      catalog: catalog || false
    });

    return NextResponse.json({ message: "File uploaded successfully", file }, { status: 201 });
  } catch (err) {
    console.error("CREATE FILE ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// → Update file info
export async function PUT(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { fileId, tags, catalog, catalogName } = body;

    if (!fileId) return NextResponse.json({ error: "fileId required" }, { status: 400 });

    await connectToDB();
    const file = await FileModel.findById(fileId);
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

    if (file.owner.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (tags) file.tags = tags;
    if (typeof catalog === "boolean") file.catalog = catalog;
    if (catalogName) file.catalogName = catalogName;

    await file.save();

    return NextResponse.json({ message: "File updated successfully", file });
  } catch (err) {
    console.error("UPDATE FILE ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE → Delete file
export async function DELETE(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { fileId } = body;
    if (!fileId) return NextResponse.json({ error: "fileId required" }, { status: 400 });

    await connectToDB();
    const file = await FileModel.findById(fileId);
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

    if (file.owner.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete physical file if exists
    const filePath = path.resolve(UPLOAD_DIR, file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await file.deleteOne();

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("DELETE FILE ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
