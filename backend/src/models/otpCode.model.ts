import mongoose, { Schema } from "mongoose";
import { jsonTransform } from "./transform.js";

export interface IOtpCode {
  email: string;
  codeHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt?: Date;
}

const otpCodeSchema = new Schema<IOtpCode>(
  {
    email: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  jsonTransform,
);

export const OtpCode = mongoose.model<IOtpCode>("OtpCode", otpCodeSchema);
