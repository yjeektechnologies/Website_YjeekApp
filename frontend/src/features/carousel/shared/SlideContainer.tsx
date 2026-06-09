import React from "react";

/**
 * Shared glassmorphism style token used across all carousel slide cards.
 * Defined here so every slide references the same values — changing it once
 * updates the look across the entire carousel.
 */
export const GLASS_CARD_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border:     "1px solid rgba(255,255,255,0.09)",
};

interface SlideContainerProps {
  children:        React.ReactNode;
  /** Optional CSS gradient or colour string for the slide background. */
  backgroundStyle?: string;
}

/**
 * SlideContainer — the outermost wrapper for every carousel slide.
 *
 * Provides the consistent scroll behaviour (vertical scroll allowed so content
 * can overflow on small screens, horizontal scroll locked to prevent layout
 * breakage) and the optional per-slide background gradient.
 */
export function SlideContainer({ children, backgroundStyle }: SlideContainerProps) {
  return (
    <div
      className="h-full w-full overflow-y-auto overflow-x-hidden"
      style={{ background: backgroundStyle ?? "transparent" }}
    >
      {children}
    </div>
  );
}
