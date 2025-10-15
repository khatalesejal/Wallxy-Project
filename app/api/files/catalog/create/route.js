// app/api/files/catalog/create/route.js

import { NextResponse } from "next/server";
import connectToDB from "../../../../util/db.js";
import { getUserFromRequest } from "../../../../util/auth.js";
import FileModel from "../../../../models/File.js";
import multer from "multer";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer for file uploads
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

async function parseFormData(req) {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, {}, (err) => {
      if (err) return reject(err);
      resolve(req.file);
    });
  });
}

// Create new catalog entry
export async function POST(req) {
  try {
    console.log("📥 Catalog Create API Hit");

    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // Parse form data (multipart)
    const formData = await req.formData();
    const catalogName = formData.get("catalogName");
    const description = formData.get("description");
    const file = formData.get("file");

    if (!file || !catalogName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save file to /public/uploads
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    fs.writeFileSync(filePath, buffer);

    // Save record in MongoDB
    const newFile = await FileModel.create({
      catalogName,
      description,
      fileUrl: `/uploads/${path.basename(filePath)}`,
      owner: user._id,
      catalog: true,
    });

    console.log("File Created:", newFile);

    return NextResponse.json(
      { message: "File uploaded successfully", file: newFile },
      { status: 201 }
    );
  } catch (err) {
    console.error("Catalog Create Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
