import { Schema, model, Document, Types } from "mongoose";
import { generateProfileId } from "./utils/generateProfileId";
import { IAddress } from "./user.model";

export interface IAdminProfile extends Document {
  user: Types.ObjectId;
  idCardNo: string;
  phone?: string;
  address?: IAddress;
  createdAt?: Date;
  updatedAt?: Date;
}

const adminProfileSchema = new Schema<IAdminProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: String,
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

const AdminProfile = model<IAdminProfile>("AdminProfile", adminProfileSchema);
export default AdminProfile;
