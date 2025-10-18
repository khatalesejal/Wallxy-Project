import { NextResponse } from "next/server.js";
import Catalog from "../../../models/Catalog.js";
import { getUserFromRequest } from "../../../util/auth.js";
import { connectToDB } from "../../../util/db.js";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    await connectToDB();

    const { id } = await context.params;
    const catalog = await Catalog.findById(id).populate("owner", "username email");

    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }


    return NextResponse.json({ success: true, data: catalog }, { status: 200 });
  } catch (err) {
    console.error("GET catalog error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// put----

export async function PUT(req, context) {
  try {
    await connectToDB();

    const { id } = context.params; // owner ID from URL
    const ownerObjectId = new mongoose.Types.ObjectId(id); // convert string to ObjectId

    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Find a single catalog for this owner
    const catalog = await Catalog.findOne({ owner: ownerObjectId });
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }

    // Check ownership
    if (catalog.owner.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({ error: "Forbidden: You are not the owner" }), { status: 403 });
    }

    // Safely parse JSON body
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), { status: 400 });
    }

    const { title, description, file } = body;

    // Update fields only if provided
    if (title) catalog.title = title;
    if (description) catalog.description = description;
    if (file && file.filename && file.fileUrl) {
      catalog.file = { filename: file.filename, fileUrl: file.fileUrl };
    }

    await catalog.save();

    return NextResponse.json({
      success: true,
      message: "Catalog updated",
      data: catalog
    }, { status: 200 });

  } catch (err) {
    console.error("PUT catalog error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// delete ------

export async function DELETE(req, context) {
  try {
    await connectToDB();

    // Correct way to get params in Next.js App Router
    const params = await context.params;
    const id = params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid catalog ID" }), { status: 400 });
    }

    const catalog = await Catalog.findById(id);
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }

    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    if (catalog.owner.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({ error: "Forbidden: You are not the owner" }), { status: 403 });
    }

    await Catalog.deleteOne({ _id: id });

    return NextResponse.json({ success: true, message: "Catalog deleted successfully" });

  } catch (err) {
    console.error("DELETE catalog error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}