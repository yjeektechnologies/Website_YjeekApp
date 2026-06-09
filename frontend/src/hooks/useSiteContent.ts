import { useState, useEffect, useMemo } from "react";
import { t } from "@/i18n/translations";
import { useLang } from "@/context/LanguageContext";

type AnyObj = Record<string, unknown>;

let _cache: { en: AnyObj; ar: AnyObj } | null = null;
let _listeners: Set<() => void> = new Set();
let _fetching = false;

// BroadcastChannel so saving from the admin tab instantly refreshes all
// other open tabs (landing page, partner pages, etc.)
let _bc: BroadcastChannel | null = null;
function getBc() {
  if (!_bc && typeof BroadcastChannel !== "undefined") {
    _bc = new BroadcastChannel("yjeek_site_content");
    _bc.onmessage = (ev) => {
      if (ev.data === "invalidate") {
        // Another tab saved — clear our cache and refetch silently
        _invalidateLocal();
      }
    };
  }
  return _bc;
}

function notifyAll() { _listeners.forEach(l => l()); }

/** Clear cache + refetch without cross-tab broadcast (used by the receiver). */
function _invalidateLocal() {
  _cache = null;
  _fetching = false;
  loadContent();
}

/** Called after a successful admin save — clears cache, refetches, and tells
 *  every other tab to do the same. */
export function invalidateSiteContent() {
  _invalidateLocal();
  try { getBc()?.postMessage("invalidate"); } catch { /* ignore */ }
}

async function loadContent() {
  if (_fetching) return;
  _fetching = true;
  try {
    // cache: "no-store" ensures we always get the latest version from the
    // server, not a stale browser HTTP cache entry.
    const res = await fetch("/api/site-content", { cache: "no-store" });
    if (res.ok) {
      const { content } = await res.json();
      _cache = content ?? { en: {}, ar: {} };
    } else {
      _cache = { en: {}, ar: {} };
    }
  } catch {
    _cache = { en: {}, ar: {} };
  } finally {
    _fetching = false;
    notifyAll();
  }
}

function mergeDeep(base: unknown, override: unknown): unknown {
  if (override === null || override === undefined) return base;
  if (typeof base === "function") {
    if (typeof override === "string") {
      const tpl = override;
      return (...args: unknown[]) => {
        let s = tpl;
        if (args[0] !== undefined) {
          s = s.replace("{country}", String(args[0])).replace("{year}", String(args[0]));
        }
        return s;
      };
    }
    return base;
  }
  if (Array.isArray(base) && Array.isArray(override)) return override;
  if (
    typeof base === "object" && base !== null && !Array.isArray(base) &&
    typeof override === "object" && !Array.isArray(override)
  ) {
    const b = base as AnyObj;
    const o = override as AnyObj;
    const result: AnyObj = { ...b };
    for (const key of Object.keys(o)) {
      result[key] = mergeDeep(b[key], o[key]);
    }
    return result;
  }
  return override ?? base;
}

export function useSiteContent() {
  const [ver, setVer] = useState(0);

  useEffect(() => {
    const bump = () => setVer(v => v + 1);
    _listeners.add(bump);
    // Ensure the BroadcastChannel is wired up in this context
    getBc();
    if (_cache === null && !_fetching) loadContent();
    return () => { _listeners.delete(bump); };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    if (!_cache) return t;
    return {
      en: mergeDeep(t.en, _cache.en) as typeof t.en,
      ar: mergeDeep(t.ar, _cache.ar) as typeof t.ar,
    };
  }, [ver]);
}

export function useTranslations() {
  const { lang } = useLang();
  const content = useSiteContent();
  return content[lang];
}
