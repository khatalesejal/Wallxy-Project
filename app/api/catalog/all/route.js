//app//api//catalog//all//route.js
import Catalog from "../../../models/Catalog.js";
import { getUserFromRequest } from "../../../util/auth.js";
import { connectToDB } from "../../../util/db.js";

export async function GET() {
  await connectToDB();

  try {
    const catalogs = await Catalog.find()
      .populate("owner", "username email")
      .sort({ createdAt: -1 }); // newest first
    return new Response(JSON.stringify(catalogs), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
