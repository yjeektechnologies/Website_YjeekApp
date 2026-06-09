import mongoose, { Schema } from "mongoose";
import { jsonTransform } from "./transform.js";

export interface IAdminSession {
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

const adminSessionSchema = new Schema<IAdminSession>(
  {
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  jsonTransform,
);

export const AdminSession = mongoose.model<IAdminSession>("AdminSession", adminSessionSchema);
