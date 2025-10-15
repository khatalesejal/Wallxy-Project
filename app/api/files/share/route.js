// app/api/files/share/route.js
import { NextResponse } from "next/server";
import connectToDB from "../../../util/db.js";
import { getUserFromRequest } from "../../../util/auth.js";
import FileModel from "../../../models/File.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileId, shareWithEmail } = await req.json();
    if (!fileId || !shareWithEmail) return NextResponse.json({ error: "fileId and shareWithEmail required" }, { status: 400 });

    await connectToDB();
    const file = await FileModel.findById(fileId);
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });
    if (file.owner.toString() !== user._id.toString()) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

    if (!file.sharedWith.includes(shareWithEmail)) file.sharedWith.push(shareWithEmail);
    await file.save();

    // create a share token that encodes fileId and recipient email for limited time
    const token = jwt.sign({ fileId: file._id, email: shareWithEmail }, JWT_SECRET, { expiresIn: "7d" });
    const shareLink = `${BASE_URL}/api/files/shared/${token}`;

    return NextResponse.json({ shareLink, token });
  } catch (err) {
    console.error("SHARE ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
