import mongoose, { Schema } from "mongoose";
import { jsonTransform } from "./transform.js";
import { getNextSequence } from "./counter.model.js";

export interface IService {
  id?: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
}

const serviceSchema = new Schema<IService>(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    // No `required` on defaulted strings: Mongoose treats "" as missing for required.
    nameAr: { type: String, default: "" },
    description: { type: String, default: "" },
    descriptionAr: { type: String, default: "" },
    icon: { type: String, default: "ShoppingBag" },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, required: true, default: true },
    sortOrder: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  jsonTransform,
);

serviceSchema.pre("save", async function (next) {
  if (this.isNew && this.id == null) {
    this.id = await getNextSequence("services");
  }
  next();
});

export const Service = mongoose.model<IService>("Service", serviceSchema);
