/**
 * Frontend domain translations barrel.
 *
 * Re-exports the canonical translation object from the existing i18n module
 * under a stable domain-layer path.  Components can import from either path;
 * having both keeps the i18n folder as the single source of truth while giving
 * the domain layer a clear, path-stable boundary.
 *
 * Usage:
 *   import { t } from "@/domain/translations";
 *   const label = t.en.hero.title;
 */
export { t } from "@/i18n/translations";
export type { Translations } from "@/i18n/translations";
