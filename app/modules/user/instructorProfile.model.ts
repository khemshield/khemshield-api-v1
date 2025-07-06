import { Document, model, Schema, Types } from "mongoose";
import { generateProfileId } from "./utils/generateProfileId";
import { IAddress } from "./user.model";

export interface IInstructorProfile extends Document {
  user: Types.ObjectId;
  idCardNo: String;
  bio?: string;
  expertise?: string[];
  certifications?: string[];
  availability?: string;
  phone?: string;
  address?: IAddress;
  avatar?: string;
  socials: {
    linkedin?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

const instructorProfileSchema = new Schema<IInstructorProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    idCardNo: { type: String, unique: true },
    bio: String,
    avatar: String,
    phone: { type: String },
    address: {
      street: String,
      state: String,
      city: String,
      country: String,
      postalCode: String,
    },
    expertise: [String],
    socials: {
      linkedin: String,
      website: String,
      twitter: String,
      whatsapp: String,
      instagram: String,
      youtube: String,
      facebook: String,
    },
    certifications: [String],
    availability: String,
  },
  { timestamps: true }
);

const InstructorProfile = model<IInstructorProfile>(
  "InstructorProfile",
  instructorProfileSchema
);
export default InstructorProfile;
