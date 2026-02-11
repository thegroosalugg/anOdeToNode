export const verticalWipe = {
     initial: { clipPath: "inset(0 0 0 0)" },
     animate: { clipPath: "inset(0 0 100% 0)" },
  transition: { duration: 0.6, ease: "easeInOut" },
};

export const skewDiagonal = {
  initial: { x: "0%", skewX: "0deg", scaleX: 1 },
  animate: {
         x: [  "0%",  "-150%"],
     skewX: ["0deg", "-45deg"],
    scaleX: [     1,      1.3],
  },
  transition: { duration: 0.6, ease: "easeInOut" },
};

// Circular expand from center then offscreen
export const circularExpand = {
  initial: { clipPath: "circle(0% at 50% 50%)" },
  animate: {
     opacity: 0,
    clipPath: [
      "circle(0% at 50% 50%)",
      "circle(80% at 50% 50%)",
      "circle(120% at 50% 50%)"
    ],
  },
  transition: { duration: 0.6, ease: "easeInOut", opacity: { delay: 0.6 } },
};

// Circular shrink to point then vanish
export const circularShrink = {
  initial: { clipPath: "circle(100% at 50% 50%)" },
  animate: {
    clipPath: [
      "circle(100% at 50% 50%)",
      "circle(20% at 50% 50%)",
      "circle(0% at 50% 50%)"
    ],
  },
  transition: { duration: 0.6, ease: "easeInOut" },
};

// Subtle scale + fade + offscreen drift
export const elegantDrift = {
  initial: { scale: 1, opacity: 1, x: "0%" },
  animate: {
      scale: [1, 1.1, 0],
    opacity: [1, 0.8, 0],
          x: ["0%", "20%", "-120%"],
  },
  transition: { duration: 0.6, ease: "easeInOut" },
};
