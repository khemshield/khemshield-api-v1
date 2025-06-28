import { Schema, model, Types, Document } from "mongoose";

export enum RequestStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
}

export interface ICollaborationRequest extends Document {
  course: Types.ObjectId;
  requester: Types.ObjectId;
  leadInstructor: Types.ObjectId;
  message?: string;
  status: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const collaborationRequestSchema = new Schema<ICollaborationRequest>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    leadInstructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.Pending,
    },
  },
  { timestamps: true }
);

const CollaborationRequest = model<ICollaborationRequest>(
  "CollaborationRequest",
  collaborationRequestSchema
);
export default CollaborationRequest;
