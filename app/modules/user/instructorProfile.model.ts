import { Document, model, Schema, Types } from "mongoose";
import { generateProfileId } from "./utils/generateProfileId";

export interface IInstructorProfile extends Document {
  user: Types.ObjectId;
  instructorId: String;
  bio?: string;
  expertise?: string[];
  certifications?: string[];
  availability?: string;
  phone?: string;
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
    instructorId: { type: String, unique: true },
    bio: String,
    avatar: String,
    phone: { type: String },
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

// Auto-generate instructorId
instructorProfileSchema.pre("save", async function (next) {
  if (!this.isNew || this.instructorId) return next();
  this.instructorId = await generateProfileId("instructor");
  next();
});

const InstructorProfile = model<IInstructorProfile>(
  "InstructorProfile",
  instructorProfileSchema
);
export default InstructorProfile;
