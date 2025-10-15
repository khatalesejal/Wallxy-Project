// app/models/File.js
import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // saved filename on disk
  originalName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  size: { type: Number },
  mimetype: { type: String },
  tags: { type: [String], default: [] },
  catalog: { type: Boolean, default: false },
  sharedWith: { type: [String], default: [] }, // emails
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.File || mongoose.model("File", FileSchema);
