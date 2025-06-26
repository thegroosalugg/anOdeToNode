import { ReactNode } from "react";
import { motion, HTMLMotionProps, TargetAndTransition } from "motion/react";
import { isMobile } from "react-device-detect";
import css from "./Button.module.css";

export type HSL = [
         hue: number, // 0-360
  saturation: number, // 0-100
   lightness: number  // 0-100
 ];

export default function Button({
         hsl,
       color = "var(--bg)",
  background = "var(--accent)",
   animateEx = {},
    children,
    ...props
}: {
           hsl?: HSL;
         color?: string;
    background?: string;
     animateEx?: TargetAndTransition;
       children: ReactNode;
} & HTMLMotionProps<"button">) {
  return (
    <motion.button
       className={css["button"]}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1, color, background, borderColor: color, ...animateEx }}
      whileHover={!isMobile ? { opacity: 0.7 } : {}}
        whileTap={{ scale: 0.9 }}
      transition={{ background: { duration: 0.5 } }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
