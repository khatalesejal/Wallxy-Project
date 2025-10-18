import mongoose from "mongoose";

const CatalogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
   file: {
      filename: { type: String, required: true },
      fileUrl: { type: String, required: true },
    },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Catalog = mongoose.models.Catalog || mongoose.model("Catalog", CatalogSchema);
export default Catalog;

