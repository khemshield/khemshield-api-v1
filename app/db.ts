import { connect } from "mongoose";

const connectDB = (connectionString?: string) =>
  connect(process.env.MONGODB_URL || connectionString || "");

export default connectDB;
