import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in .env");
    }

    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    console.log(`✅ MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection ERROR:", error.message);
    process.exit(1);
  }
};

export default connectDB;