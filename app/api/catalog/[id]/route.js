import { NextResponse } from "next/server.js";
import cloudinary from "../../../util/cloudinary.js";
import Catalog from "../../../models/Catalog.js";
import File from "../../../models/File.js";
import { getUserFromRequest } from "../../../util/auth.js";
import { connectToDB } from "../../../util/db.js";
import mongoose from "mongoose";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


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
    console.log("req1>>>>",req)
    console.log("req3>>>>",context)


    const { id } = context.params; // owner ID from URL
    const ownerObjectId = new mongoose.Types.ObjectId(id); // convert string to ObjectId

    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Find a single catalog for this owner
    const catalog = await Catalog.findOne({ _id: ownerObjectId });
    if (!catalog) {
      return new Response(JSON.stringify({ error: "Catalog not found1",id:id }), { status: 404 });
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

    const { title, description, fileUrl, filename: newFilename, public_id} = body;
    
    // If a new file is uploaded, delete the old file from Cloudinary
    if (fileUrl && catalog.file?.fileUrl && catalog.file?.public_id) {
      try {
        await cloudinary.uploader.destroy(catalog.file.public_id);
        console.log("Old Cloudinary file deleted");
      } catch (error) {
        console.error("Cloudinary delete failed:", error.message);
      }
    }

    // Update catalog fields
    if (title) catalog.title = title;
    if (description !== undefined) catalog.description = description;

    // If new file uploaded
    if (fileUrl) {
      const filename =
        newFilename || catalog.file?.filename || fileUrl.split("/").pop() || "document.pdf";
      catalog.file = {
        filename,
        fileUrl,
        public_id, //Save Cloudinary public_id for future deletes
      };
    }

    // Update File model (if exists)
    const updateData = {};
    if (title) updateData.catalogName = title;
    if (description !== undefined) updateData.description = description;

    if (fileUrl) {
      updateData.fileUrl = fileUrl;
      updateData.filename =
        newFilename || catalog.file?.filename || fileUrl.split("/").pop() || "document.pdf";
    }

    if (Object.keys(updateData).length > 0) {
      await File.findOneAndUpdate({ catalogId: catalog._id }, updateData, { upsert: false });
    }

    await catalog.save();

    return NextResponse.json(
      {
        success: true,
        message: "Catalog updated successfully",
        data: catalog,
      },
      { status: 200 }
    );
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
    
       // Delete from Cloudinary
    if (catalog.file && catalog.file.fileUrl) {
      try {
        const fileUrl = catalog.file.fileUrl;
        const parts = fileUrl.split("/upload/");
        const publicId = parts[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
        console.log(" File deleted from Cloudinary:", publicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err.message);
      }
    }
    
    // //  Delete file from Cloudinary
    // if (catalog.file?.fileUrl) {
    //   try {
    //     const fileUrl = catalog.file.fileUrl;
    //     const publicId = fileUrl
    //       .split("/upload/")[1]
    //       .replace(/^v\d+\//, "")
    //       .replace(/\.[^/.]+$/, "");

    //     console.log(" Deleting from Cloudinary:", publicId);

    //     const result = await cloudinary.v2.uploader.destroy(publicId, {
    //       resource_type: "raw",
    //     });

    //     console.log(" Cloudinary delete result:", result);
    //   } catch (err) {
    //     console.error(" Cloudinary delete failed:", err.message);
    //   }
    // }
    await Catalog.deleteOne({ _id: id });
    // await Catalog.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Catalog deleted successfully" });

  } catch (err) {
    console.error("DELETE catalog error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}