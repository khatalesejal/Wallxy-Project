import { NextResponse } from "next/server";
import { connectToDB } from "../../../util/db.js";
import cloudinary from "cloudinary";
import File from "../../../models/File.js";
import formidable from "formidable";
import { getUserFromRequest } from "../../../util/auth.js";
import { Readable } from "stream";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Convert Next.js Request to Node.js readable stream
function requestToNodeStream(req) {
  const readable = new Readable();
  readable._read = () => { };

  // Copy headers for formidable
  readable.headers = Object.fromEntries(req.headers.entries());

  req.arrayBuffer().then((buf) => {
    readable.push(Buffer.from(buf));
    readable.push(null);
  });

  return readable;
}

// Parse form-data safely
async function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
    });

    const nodeReq = requestToNodeStream(req);

    form.parse(nodeReq, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

// POST handler: Upload file
export async function POST(req) {
  try {
    //Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized — provide a valid token" },
        { status: 401 }
      );
    }

    //Connect to MongoDB
    await connectToDB();

    //Parse form-data
    const { fields, files } = await parseFormData(req);

    if (!files || !files.file) {
      return NextResponse.json(
        { error: "No file uploaded. Ensure form-data key is 'file'" },
        { status: 400 }
      );
    }

    // Support array in case formidable returns multiple files
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile.filepath) {
      return NextResponse.json(
        { error: "Filepath not found. Check the uploaded file." },
        { status: 400 }
      );
    }

    //Upload to Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(
      uploadedFile.filepath,
      {
        folder: "wallxy_uploads",
        resource_type: "raw",
        use_filename: true,
        unique_filename: false

      }
    );
    console.log("uploadResult",uploadResult)

    //Save file metadata to MongoDB
    const newFile = await File.create({
      catalogName: fields.catalogName?.[0] || "Untitled Catalog",
      description: fields.description?.[0] || "",
      fileUrl: uploadResult.secure_url,
      filename: uploadResult.original_filename,
      owner: user._id,
      size: uploadResult.bytes,
      mimetype: uploadResult.format,
      tags: fields.tags ? fields.tags[0].split(",") : [],
      catalog: fields.catalog === "true",
    });

    //Respond success
    return NextResponse.json(
      { message: "File uploaded successfully!", file: newFile },
      { status: 200 }
    );
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Upload failed", details: err.message },
      { status: 500 }
    );
  }
}
