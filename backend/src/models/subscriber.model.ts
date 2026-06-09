import mongoose, { Schema } from "mongoose";
import { jsonTransform } from "./transform.js";
import { getNextSequence } from "./counter.model.js";

export interface ISubscriber {
  id?: number;
  email: string;
  launchId?: number | null;
  city?: string | null;
  country?: string | null;
  createdAt?: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    id: { type: Number, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    launchId: { type: Number, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  jsonTransform,
);

subscriberSchema.pre("save", async function (next) {
  if (this.isNew && this.id == null) {
    this.id = await getNextSequence("subscribers");
  }
  next();
});

export const Subscriber = mongoose.model<ISubscriber>("Subscriber", subscriberSchema);
