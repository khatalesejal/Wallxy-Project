// util/db.js
import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDB(retries = 5) {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;

  while (retries > 0) {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('✅ MongoDB connected');
      break;
    } catch (err) {
      console.error(`❌ MongoDB connection error: ${err.message}`);
      retries -= 1;
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(res => setTimeout(res, 3000)); // wait 3 sec before retry
    }
  }

  if (!isConnected) {
    throw new Error('Failed to connect to MongoDB after multiple attempts');
  }
}
