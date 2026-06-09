import { z } from "zod";

// ── Launches ─────────────────────────────────────────────────────────────────

export const CreateLaunchSchema = z.object({
  city: z.string().min(1, "City is required"),
  cityAr: z.string().optional().default(""),
  country: z.string().min(1, "Country is required"),
  countryCode: z.string().min(1, "Country code is required"),
  launchDate: z.coerce.date(),
  description: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const UpdateLaunchSchema = z.object({
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  launchDate: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

// ── Subscribers ──────────────────────────────────────────────────────────────

export const RegisterSubscriberSchema = z.object({
  email: z.string().email("A valid email address is required"),
  launchId: z.number().int().positive().optional(),
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
});

// ── Contact forms ────────────────────────────────────────────────────────────

export const PartnerEnquirySchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("A valid email address is required"),
  phone: z.string().min(5, "A valid phone number is required"),
  businessType: z.string().min(1, "Business type is required"),
  branches: z.string().optional(),
  city: z.string().min(1, "City is required"),
  message: z.string().optional(),
});

export const DriverApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("A valid email address is required"),
  phone: z.string().min(5, "A valid phone number is required"),
  city: z.string().min(1, "City is required"),
  vehicle: z.string().min(1, "Vehicle type is required"),
  experience: z.string().optional(),
  message: z.string().optional(),
});

// ── Services ─────────────────────────────────────────────────────────────────

export const ServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  nameAr: z.string().optional().default(""),
  description: z.string().optional().default(""),
  descriptionAr: z.string().optional().default(""),
  icon: z.string().optional().default("ShoppingBag"),
  imageUrl: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

// ── Testimonials ─────────────────────────────────────────────────────────────

export const TestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAr: z.string().optional().default(""),
  role: z.string().optional().default(""),
  roleAr: z.string().optional().default(""),
  city: z.string().optional().default(""),
  text: z.string().min(1, "Review text is required"),
  textAr: z.string().optional().default(""),
  rating: z.coerce.number().int().min(1).max(5).optional().default(5),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

// ── Admin auth ───────────────────────────────────────────────────────────────

export const LoginAdminSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const VerifyOtpSchema = z.object({
  email: z.string().min(1, "Email is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});
