import mongoose, { Schema, type HydratedDocument } from "mongoose";
import { jsonTransform } from "./transform.js";
import { getNextSequence } from "./counter.model.js";

export interface ILaunch {
  id?: number;
  city: string;
  cityAr: string;
  country: string;
  countryCode: string;
  launchDate: Date;
  description?: string | null;
  descriptionAr?: string | null;
  isActive: boolean;
  createdAt?: Date;
}

const launchSchema = new Schema<ILaunch>(
  {
    id: { type: Number, unique: true, index: true },
    city: { type: String, required: true },
    // cityAr can be an empty string (zod defaults it to ""), so no `required`.
    cityAr: { type: String, default: "" },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    launchDate: { type: Date, required: true },
    description: { type: String, default: null },
    descriptionAr: { type: String, default: null },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  jsonTransform,
);

launchSchema.pre("save", async function (next) {
  if (this.isNew && this.id == null) {
    this.id = await getNextSequence("launches");
  }
  next();
});

export type LaunchDocument = HydratedDocument<ILaunch>;
export const Launch = mongoose.model<ILaunch>("Launch", launchSchema);
