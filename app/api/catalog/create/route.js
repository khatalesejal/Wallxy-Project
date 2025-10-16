
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
    const { title, description, fileUrl } = body;

    if (!title || !fileUrl) {
      return new Response(JSON.stringify({ error: "Title and File URL are required" }), { status: 400 });
    }

    const catalog = await Catalog.create({ title, description, fileUrl, owner: user._id });
    return NextResponse.json({
    data : {catalog} , success : true ,message : "catlog created sucessfully "
    }, {status : 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
