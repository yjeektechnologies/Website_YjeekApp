import type { ConsentLevel } from "../../domain/types";

const CONSENT_KEY   = "yjeek_cookie_consent";
const COUNTRY_KEY   = "yjeek_country";
const CONSENT_EVENT = "yjeek:consent";

/**
 * Typed localStorage wrapper for cookie consent management.
 *
 * Keeping all localStorage reads/writes behind this module means:
 *  1. The key strings can only drift in one place.
 *  2. Consent-gated writes (country preference, analytics) can be guarded
 *     centrally rather than scattered across hooks and components.
 *  3. SSR / test environments can stub this module without touching browser APIs.
 */

/** Read the current consent level from localStorage. */
export function getConsentLevel(): ConsentLevel {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw === "all" || raw === "essential") return raw;
    return null;
  } catch {
    return null;
  }
}

/** Persist the user's consent choice and dispatch the consent event. */
export function setConsentLevel(level: "all" | "essential"): void {
  try {
    localStorage.setItem(CONSENT_KEY, level);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { level } }));
  } catch {
    // localStorage may be blocked in private-browsing mode — fail silently
  }
}

/** True when the user has granted any level of consent. */
export function hasConsent(): boolean {
  return getConsentLevel() !== null;
}

/** True when the user has granted full (analytics) consent. */
export function hasFullConsent(): boolean {
  return getConsentLevel() === "all";
}

/**
 * Persist the currently selected country code, but ONLY when the user has
 * granted consent. Calling this without consent is a no-op.
 */
export function saveCountryPreference(countryCode: string): void {
  if (!hasConsent()) return;
  try {
    localStorage.setItem(COUNTRY_KEY, countryCode);
  } catch {
    // Fail silently
  }
}

/** Read the saved country code preference, or null when not set. */
export function getSavedCountryCode(): string | null {
  try {
    return localStorage.getItem(COUNTRY_KEY);
  } catch {
    return null;
  }
}

/** Remove all Yjeek-managed localStorage keys (used when consent is withdrawn). */
export function clearAllPreferences(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(COUNTRY_KEY);
  } catch {
    // Fail silently
  }
}
