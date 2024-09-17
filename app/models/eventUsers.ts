import { Schema, model } from "mongoose";

const eventSubscriberSchema = new Schema(
  {
    // TODO: Point to an actual event in the database
    event: String,
    email: {
      type: String,
      required: true,
      unique: true, // Ensure unique emails
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
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    // state: { type: String, required: true },
    // city: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const EventSubscriber = model("EventSubscriber", eventSubscriberSchema);

export default EventSubscriber;
