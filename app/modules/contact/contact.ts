import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"], // Email format validation
    },
    phone: {
      type: String,
      required: true,
      match: [
        /^(?:\+?[1-9]{1,5})?\d{10,14}$/,
        "Please enter a valid phone number",
      ], // Basic phone number format validation
    },
    fullName: { type: String, required: true },
    helpwith: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Contact = model("Contact", contactSchema);

export default Contact;
