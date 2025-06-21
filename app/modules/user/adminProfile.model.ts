import { Schema, model, Document, Types } from "mongoose";
import { generateProfileId } from "./utils/generateProfileId";

export interface IAdminProfile extends Document {
  user: Types.ObjectId;
  adminId: string;
  phone?: string;
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
    adminId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate adminId before saving
adminProfileSchema.pre("save", async function (next) {
  if (!this.isNew || this.adminId) return next();
  this.adminId = await generateProfileId("admin");
  next();
});

const AdminProfile = model<IAdminProfile>("AdminProfile", adminProfileSchema);
export default AdminProfile;
