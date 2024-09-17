import { connect } from "mongoose";

const connectDB = () => connect(process.env.MONGODB_URL || "");

export default connectDB;
