import { Document, model, Schema, Types } from "mongoose";
import { IAddress } from "./user.model";

export interface IStudentProfile extends Document {
  user: Types.ObjectId;
  idCardNo: string;
  phone: string;
  address?: IAddress;
  avatar?: String;
}

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    avatar: String,
    phone: { type: String, required: true },
    address: {
      street: String,
      state: String,
      city: String,
      country: String,
      postalCode: String,
    },
    idCardNo: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const StudentProfile = model<IStudentProfile>(
  "StudentProfile",
  studentProfileSchema
);
export default StudentProfile;
