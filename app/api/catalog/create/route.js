import { NextResponse } from "next/server.js";
import Catalog from "../../../models/Catalog.js";
import { getUserFromRequest } from "../../../util/auth.js";
import { connectToDB } from "../../../util/db.js";

export async function POST(req) {
  await connectToDB();
  const user = await getUserFromRequest(req);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, fileUrl, filename, public_id} = body;

    if (!title || !fileUrl || !filename || !public_id) {
      return new Response(
        JSON.stringify({ error: "Title, Filename, File URL and public_id are required" }),
        { status: 400 }
      );
    }

    const catalog = await Catalog.create({
      title,
      description,
      file: { filename, fileUrl, public_id },
      owner: user._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Catalog created successfully",
        data: {
          title,
          description,
          file: { filename, fileUrl, public_id},
          owner: user._id,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Catalog creation error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}