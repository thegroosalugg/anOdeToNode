import { stagger, useAnimate } from "motion/react";
import { useRef } from "react";

export const useAnimations = () => {
  const [scope, animate] = useAnimate();
  const flipRef = useRef(false);

  const shake = (element: string) =>
    animate(
      element,
      { x: [null, 10, 0, 10, 0] },
      { repeat: 1, duration: 0.3, delay: stagger(0.1) }
    );

  const shoot = (element: string) => {
    flipRef.current = !flipRef.current;
    const rotate = flipRef.current ? [2, 3, 6] : [-2, -3, -6];
    animate(
      element,
      {
              y: [null, -30, -40, -45, 0],
        opacity: [   0,   1,   1,   0, 0],
         rotate: [   0, ...rotate,     0],
          scale: [   1,   1,  1.1,  1, 1],
      },
      {
        duration: 1.2,
           times: [0, 0.2, 0.5, 0.9, 1],
            ease: "easeOut",
      }
    );
  };

  return { scope, animate, shake, shoot };
};
