import { Target, Variant, Transition } from "framer-motion";

const  opacity = 0;
const duration = 0.5;
const     ease = "easeInOut"

interface Animations {
     initial: Target
     animate: Variant
  transition: Transition
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
