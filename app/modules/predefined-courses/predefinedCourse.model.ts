import { Schema, model, Types, Document } from "mongoose";
import { DurationUnit as EDurationUnit } from "../course/course.model";

export interface IPredefinedCourse extends Document {
  title: string;
  description?: string;
  category: Types.ObjectId;
  basePrice: number;
  baseDuration: {
    length: number;
    unit: EDurationUnit;
  };
}

const predefinedCourseSchema = new Schema<IPredefinedCourse>(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    basePrice: { type: Number, required: true },
    baseDuration: {
      length: { type: Number, required: true },
      unit: {
        type: String,
        enum: Object.values(EDurationUnit),
        required: true,
      },
    },
  },
  { timestamps: true }
);

const PredefinedCourse = model<IPredefinedCourse>(
  "PredefinedCourse",
  predefinedCourseSchema
);
export default PredefinedCourse;
