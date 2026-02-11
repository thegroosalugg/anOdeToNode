import { stagger, useAnimate } from "motion/react";

export const useAnimations = () => {
  const [scope, animate] = useAnimate();

  const shake = (element: string) =>
    animate(element, { x: [null, 10, 0, 10, 0] }, { repeat: 1, duration: 0.3, delay: stagger(0.1) });

  const shoot = (element: string, config?: { x?: boolean, dir?: 1 | -1 }) => {
    const { x, dir = -1 } = config ?? {};
    const animation: Record<string, number[]> = { opacity: [0, 1, 0], scale: [1, 1] };
    const translate = [0, 20 * dir];
    animation[x ? "x" : "y"] = translate;
    animate(element, animation, { duration: 0.8, ease: "easeOut" });
  };

  return { scope, animate, shake, shoot };
};
