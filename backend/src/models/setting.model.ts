import mongoose, { Schema } from "mongoose";
import { jsonTransform } from "./transform.js";

/**
 * Flat key-value settings store (mirrors the original `settings` table).
 * The string `key` is the primary key, mapped to Mongo's _id.
 */
export interface ISetting {
  _id: string; // the setting key
  value: string;
  updatedAt?: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    _id: { type: String, required: true },
    value: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
  },
  jsonTransform,
);

export const Setting = mongoose.model<ISetting>("Setting", settingSchema);
