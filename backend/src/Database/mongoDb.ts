import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const MongoDBUrl: string = process.env.MONGODB_URI || "";

/**
 * MongoDB connection
 */
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MongoDBUrl);
    console.log(`MongoDB Connected ${mongoose.connection.host}`);
  } catch (error: any) {
    console.log(`${error.message}`);
    setTimeout(connectMongoDB, 5000);
  }
};
