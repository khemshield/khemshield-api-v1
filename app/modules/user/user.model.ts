import { Schema, model, Types, Document } from "mongoose";

export enum UserRole {
  Admin = "admin",
  Instructor = "instructor",
  Student = "student",
}

export enum AccountStatus {
  Active = "active",
  Suspended = "suspended",
  Deactivated = "deactivated",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roles: UserRole[];
  instructorProfile?: Types.ObjectId;
  studentProfile?: Types.ObjectId;
  adminProfile?: Types.ObjectId;

  createdBy?: Types.ObjectId;
  mustChangePassword: boolean;
  accountStatus: AccountStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.Student],
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    mustChangePassword: { type: Boolean, default: false },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.Active,
    },

    // Links to profile documents (optional, created on demand)
    instructorProfile: {
      type: Schema.Types.ObjectId,
      ref: "InstructorProfile",
    },
    studentProfile: { type: Schema.Types.ObjectId, ref: "StudentProfile" },
    adminProfile: { type: Schema.Types.ObjectId, ref: "AminProfile" },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
