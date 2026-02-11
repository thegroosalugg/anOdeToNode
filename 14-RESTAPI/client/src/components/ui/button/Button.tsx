import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { Color } from "@/lib/types/colors";
import css from "./Button.module.css";
import { createAnimations } from "@/lib/motion/animations";

const animations = createAnimations();

export default function Button({
       color = "page",
  background = "accent",
      border,
    children,
    ...props
}: {
         color?: Color;
        border?: Color;
    background?: Color;
       children: ReactNode;
} & HTMLMotionProps<"button">) {
  const toCssVar = (color: Color) => `var(--${color})`;
  const borderColor = border ? border : background;

  return (
    <motion.button
      className={css["button"]}
      style={
        {
          "--color":        toCssVar(color),
          "--background":   toCssVar(background),
          "--border-color": toCssVar(borderColor),
        } as React.CSSProperties
      }
      whileTap={{ scale: 0.9 }}
      {...animations}
      {...props}
    >
      {children}
    </motion.button>
  );
}
