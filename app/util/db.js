// util/db.js
import mongoose from "mongoose";

const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("✅ MongoDB connected");
};

export default connectToDB;
