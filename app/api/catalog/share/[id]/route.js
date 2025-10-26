import Catalog from "../../../../models/Catalog.js";
import { connectToDB } from "../../../../util/db.js";

export async function GET(req, context) {
  await connectToDB();

  // Correct way to get dynamic param
  const catalogId = context.params.id; 

  if (!catalogId) {
    return new Response(JSON.stringify({ error: "Catalog ID not provided" }), { status: 400 });
  }

  try {
    const catalog = await Catalog.findById(catalogId).populate("owner", "username email");
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        shareLink: `${process.env.BASE_URL}/catalog/view/${catalog._id}`,
        catalog,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
