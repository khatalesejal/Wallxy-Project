// import { NextResponse } from "next/server.js";
// import Catalog from "../../../models/Catalog.js";
// import { getUserFromRequest } from "../../../util/auth.js";
// import { connectToDB } from "../../../util/db.js";

// /**
//  * ✅ GET Single Catalog by ID
//  */
// export async function GET(req, context) {
//   try {
//     await connectToDB();

//     const { id } = context.params;
//     const catalog = await Catalog.findById(id).populate("owner", "username email");

//     if (!catalog) {
//       return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         data: catalog,
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("GET catalog error:", err);
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }

// /**
//  * ✅ PUT Update Catalog
//  */
// export async function PUT(req, context) {
//   try {
//     await connectToDB();
//      const { id } = await context.params;
//     const user = await getUserFromRequest(req);
//  //const { id } = await context.params;
//     if (!user) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//     }

//     const existingCatalog = await Catalog.findById(id);
//     if (!existingCatalog) {
//       return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
//     }

//     // Ensure only owner can edit
//     if (existingCatalog.owner.toString() !== user._id.toString()) {
//       return new Response(JSON.stringify({ error: "Forbidden: You don’t own this catalog" }), {
//         status: 403,
//       });
//     }

//     const body = await req.json();
//     const { title, description, fileUrl, filename } = body;

//     if (!title && !description && !fileUrl && !filename) {
//       return new Response(JSON.stringify({ error: "No fields provided for update" }), { status: 400 });
//     }

//     if (title) existingCatalog.title = title;
//     if (description) existingCatalog.description = description;
//     if (fileUrl && filename) {
//       existingCatalog.file = { filename, fileUrl };
//     }

//     await existingCatalog.save();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Catalog updated successfully",
//         data: existingCatalog,
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("PUT catalog error:", err);
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }

// /**
//  * ✅ DELETE Catalog
//  */
// export async function DELETE(req, context) {
//   try {
//     await connectToDB();
//     const { id } = context.params;
//     const user = await getUserFromRequest(req);

//     if (!user) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//     }

//     const catalog = await Catalog.findById(id);
//     if (!catalog) {
//       return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
//     }

//     // Ensure only owner can delete
//     if (catalog.owner.toString() !== user._id.toString()) {
//       return new Response(JSON.stringify({ error: "Forbidden: You don’t own this catalog" }), {
//         status: 403,
//       });
//     }

//     await Catalog.findByIdAndDelete(id);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Catalog deleted successfully",
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("DELETE catalog error:", err);
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }


import { NextResponse } from "next/server.js";
import Catalog from "../../../models/Catalog.js";
import { getUserFromRequest } from "../../../util/auth.js";
import { connectToDB } from "../../../util/db.js";

export async function GET(req, context) {
  try {
    await connectToDB();

    const { id } = await context.params; // ✅ always await params
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

export async function PUT(req, context) {
  try {
    await connectToDB();

    const { id } = await context.params;
    const user = await getUserFromRequest(req);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const catalog = await Catalog.findById(id);
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }

    // ✅ Fix: Compare strings, make sure both are strings
    if (catalog.owner.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({ error: "Forbidden: You are not the owner" }), {
        status: 403,
      });
    }

    const body = await req.json();
    const { title, description, fileUrl, filename } = body;

    if (title) catalog.title = title;
    if (description) catalog.description = description;
    if (fileUrl && filename) catalog.file = { filename, fileUrl };

    await catalog.save();

    return NextResponse.json({ success: true, message: "Catalog updated", data: catalog }, { status: 200 });
  } catch (err) {
    console.error("PUT catalog error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectToDB();

    const { id } = await context.params;
    const user = await getUserFromRequest(req);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const catalog = await Catalog.findById(id);
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), { status: 404 });
    }

    // ✅ Only owner can delete
    if (catalog.owner.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({ error: "Forbidden: You are not the owner" }), {
        status: 403,
      });
    }

    await Catalog.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Catalog deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE catalog error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
