import { Schema, model } from "mongoose";

export interface ICategory {
  name: string;
  description?: string;
  predefinedCourses: {
    title: string;
    description?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    predefinedCourses: [
      {
        title: { type: String, required: true },
        description: { type: String },
      },
    ],
  },
  {
    timestamps: true, // optional: auto add createdAt & updatedAt
  }
);

// Model with type support
const Category = model<ICategory>("Category", categorySchema);

export default Category;
