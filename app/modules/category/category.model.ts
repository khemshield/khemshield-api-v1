import { Schema, model } from "mongoose";

export interface ICategory {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
  },
  {
    timestamps: true, // optional: auto add createdAt & updatedAt
  }
);

// Model with type support
const Category = model<ICategory>("Category", categorySchema);

export default Category;
