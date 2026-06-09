/**
 * carousel-slides.tsx — Re-export barrel
 *
 * Each slide now lives in its own atomic file under
 * `src/features/carousel/slides/`. This file exists only to preserve
 * backward-compatible import paths for any component that already imports
 * from "@/components/carousel-slides". New code should import directly
 * from the feature module.
 *
 * DEFAULT_CATEGORY_BADGES is also re-exported here because it was part of
 * the original public surface of this file (used by CategoriesSlide).
 */

export { HeroSlide }          from "@/features/carousel/slides/HeroSlide";
export { CategoriesSlide }    from "@/features/carousel/slides/CategoriesSlide";
export { HowItWorksSlide }    from "@/features/carousel/slides/HowItWorksSlide";
export { FeaturesSlide }      from "@/features/carousel/slides/FeaturesSlide";
export { AppDownloadSlide }   from "@/features/carousel/slides/AppDownloadSlide";
export { PartnersSlide }      from "@/features/carousel/slides/PartnersSlide";
export { TestimonialsSlide }  from "@/features/carousel/slides/TestimonialsSlide";
export { ComingSoonSlide }    from "@/features/carousel/slides/ComingSoonSlide";
