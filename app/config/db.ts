import mongoose from "mongoose";

const connectDB = (connectionString?: string) =>
  mongoose.connect(process.env.MONGODB_URL || connectionString || "");

export default connectDB;
