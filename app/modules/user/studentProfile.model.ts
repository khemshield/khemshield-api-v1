import { Schema, model, Types, Document } from "mongoose";
import { generateProfileId } from "./utils/generateProfileId";

enum EnrolledStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
}

enum LearningMethod {
  HYBRID = "hybrid",
  IN_PERSON = "in-person",
  VIRTUAL = "virtual",
}

interface IEnrolledCourses extends Document {
  course: Types.ObjectId;
  enrolledAt: Date;
  status: EnrolledStatus;
  learningMethod: LearningMethod;
}

export interface IStudentProfile extends Document {
  user: Types.ObjectId;
  studentId: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  enrolledCourses: IEnrolledCourses[];
}

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String, required: true },
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    studentId: {
      type: String,
      unique: true,
    },
    enrolledCourses: [
      {
        course: { type: Schema.Types.ObjectId, ref: "Course" },
        enrolledAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: Object.values(EnrolledStatus),
          default: "active",
        },
        learningMethod: {
          type: String,
          enum: Object.values(LearningMethod),
          default: "in-person",
        },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate studentId
studentProfileSchema.pre("save", async function (next) {
  if (!this.isNew || this.studentId) return next();
  this.studentId = await generateProfileId("student");
  next();
});

const StudentProfile = model<IStudentProfile>(
  "StudentProfile",
  studentProfileSchema
);
export default StudentProfile;
