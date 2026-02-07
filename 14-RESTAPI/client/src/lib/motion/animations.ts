import { Target, Variant, Transition } from "framer-motion";
import { Direction } from "../types/common";

const  opacity = 0;
const duration = 0.5;
const     ease = "easeInOut"

export interface Animations {
     initial?: Target
     animate?: Variant
  transition?: Transition
}

export const createAnimations = ({
     initial = {},
     animate = {},
  transition = {},
}: Partial<Animations> = {}) => {
  const fade = { opacity, ...initial };
  return {
       initial: fade,
       animate: { opacity: 1, ...animate },
          exit: fade,
    transition: { duration, ease, ...transition },
  };
};

export const createVariants = ({
     initial = {},
     animate = {},
  transition = {},
}: Partial<Animations> = {}) => {
  return {
     hidden: { opacity,    ...initial },
    visible: { opacity: 1, ...animate, transition: { duration, ease, ...transition } },
  };
};

export const custom = {
   enter: (direction: Direction) => ({ opacity: 0, x: direction > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0 },
    exit: (direction: Direction) => ({ opacity: 0, x: direction < 0 ? 50 : -50 }),
};
