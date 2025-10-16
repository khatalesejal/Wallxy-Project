// app/api/catalog/[id]/route.js

import Catalog from "../../../models/Catalog.js";
import { connectToDB } from "../../../util/db.js";
import { getUserFromRequest } from "../../../util/auth.js"; // make sure you have this

/**
 * GET catalog by ID
 */
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    const catalog = await Catalog.findById(id);
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(catalog), { status: 200 });
  } catch (err) {
    console.error("GET CATALOG ERROR:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

//PUT -- edit catalog by ID
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });
    }

    // Find catalog and ensure owner is the same user
    const catalog = await Catalog.findById(id);
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }

    if (catalog.owner.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({ error: "You do not have permission to edit this catalog" }), { status: 403 });
    }

    // Update fields
    catalog.title = title;
    if (description !== undefined) catalog.description = description;

    const updatedCatalog = await catalog.save();

    return new Response(JSON.stringify(updatedCatalog), { status: 200 });
  } catch (err) {
    console.error("PUT CATALOG ERROR:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

// DELETE -- catalog by ID
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // Authenticate user
    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const catalog = await Catalog.findById(id);
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }

    if (catalog.owner.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({ error: "You do not have permission to delete this catalog" }), { status: 403 });
    }

    await catalog.deleteOne();

    return new Response(JSON.stringify({ message: "Catalog deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("DELETE CATALOG ERROR:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
