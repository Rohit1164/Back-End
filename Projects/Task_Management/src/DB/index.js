import mongoose from "mongoose";
import dotenv from "dotenv";

const DB_NAME = "Task_Management";
dotenv.config({ path: "./.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
  }
};

export default connectDB;
