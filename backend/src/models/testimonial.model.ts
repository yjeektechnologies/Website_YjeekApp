import mongoose, { Schema } from "mongoose";
import { jsonTransform } from "./transform.js";
import { getNextSequence } from "./counter.model.js";

export interface ITestimonial {
  id?: number;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  city: string;
  text: string;
  textAr: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    // No `required` on defaulted strings: Mongoose treats "" as missing for required.
    nameAr: { type: String, default: "" },
    role: { type: String, default: "" },
    roleAr: { type: String, default: "" },
    city: { type: String, default: "" },
    text: { type: String, required: true },
    textAr: { type: String, default: "" },
    rating: { type: Number, required: true, default: 5 },
    isActive: { type: Boolean, required: true, default: true },
    sortOrder: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  jsonTransform,
);

testimonialSchema.pre("save", async function (next) {
  if (this.isNew && this.id == null) {
    this.id = await getNextSequence("testimonials");
  }
  next();
});

export const Testimonial = mongoose.model<ITestimonial>("Testimonial", testimonialSchema);
