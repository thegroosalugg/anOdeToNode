import { stagger, useAnimate } from "motion/react";

export const useAnimations = () => {
  const [scope, animate] = useAnimate();

  const shake = (element: string) =>
    animate(
      element,
      { x: [null, 10, 0, 10, 0] },
      { repeat: 1, duration: 0.3, delay: stagger(0.1) }
    );

  return { scope, animate, shake };
};
