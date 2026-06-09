import React, { createContext, useContext } from "react";

export interface SlideContextType {
  currentSlide: number;
  goToSlide: (index: number) => void;
  totalSlides: number;
}

export const SlideContext = createContext<SlideContextType>({
  currentSlide: 0,
  goToSlide: () => {},
  totalSlides: 0,
});

export const useSlide = () => useContext(SlideContext);
