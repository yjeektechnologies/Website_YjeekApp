/**
 * Canonical domain type definitions for the Yjeek frontend.
 *
 * Importing from this file (instead of from individual hooks or components)
 * prevents the same interface from being redefined in multiple places and
 * makes it easy to discover all first-class business concepts in the codebase.
 *
 * Hooks and components should import types from here rather than defining their own.
 */

/** ISO-3166-1 alpha-2 country code (e.g. "BH", "AE"). */
export type CountryCode = string;

/** UI language — English or Arabic (RTL). */
export type Language = "en" | "ar";

/** A GCC/MENA country supported by Yjeek. */
export interface SupportedCountry {
  code:     CountryCode;
  name:     string;
  nameAr:   string;
  flag:     string;
  currency: string;
  cities:   string[];
}

/** A social media platform and its admin-configured URL. */
export interface SocialLink {
  url:     string;
  enabled: boolean;
}

/** Bilingual label shown on a service category badge in the carousel. */
export interface CategoryBadge {
  label:   string;
  labelAr: string;
}

/** A country as returned by the /api/site-config endpoint. */
export interface SiteCountry {
  code:     CountryCode;
  name:     string;
  nameAr?:  string;
  flag:     string;
  currency: string;
}

/**
 * Public site configuration — loaded once at startup and cached.
 * Drives the navbar country selector, social links, app-store CTAs, and carousel badges.
 */
export interface SiteConfig {
  logoUrl:            string;
  faviconUrl:         string;
  appStoreUrl:        string;
  googlePlayUrl:      string;
  socialLinks:        Record<string, SocialLink>;
  supportedCountries: SiteCountry[];
  categoryBadges:     Record<string, CategoryBadge>;
}

/** A single admin-managed city launch. */
export interface Launch {
  id:          number;
  city:        string;
  country:     string;
  launchDate:  string | Date;
  isActive:    boolean;
  description?: string | null;
  imageUrl?:   string | null;
  createdAt:   string | Date;
}

/** A customer testimonial shown on the landing page. */
export interface Testimonial {
  id:        number;
  name:      string;
  nameAr:    string;
  role:      string;
  roleAr:    string;
  city:      string;
  text:      string;
  textAr:    string;
  rating:    number;
  isActive:  boolean;
  sortOrder: number;
  createdAt: string | Date;
}

/** A delivery service category (Food, Groceries, Pharmacy, etc.). */
export interface Service {
  id:            number;
  name:          string;
  nameAr:        string;
  description:   string;
  descriptionAr: string;
  icon:          string;
  imageUrl:      string;
  isActive:      boolean;
  sortOrder:     number;
  createdAt:     string | Date;
}

/** Headline statistics shown on the landing page hero section. */
export interface SiteStats {
  partners:    string;
  deliveries:  string;
  cities:      string;
  rating:      string;
  ratingCount: string;
}

/** User's cookie consent choice. */
export type ConsentLevel = "all" | "essential" | null;