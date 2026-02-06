import { ReactNode } from "react";
import { motion, HTMLMotionProps, TargetAndTransition } from "motion/react";
import { Color } from "@/lib/types/colors";
import css from "./Button.module.css";

export default function Button({
       color = "page",
  background = "accent",
      border,
  animations = {},
    disabled = false,
    children,
    ...props
}: {
         color?: Color;
        border?: Color;
    background?: Color;
    animations?: TargetAndTransition;
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
       initial={{ opacity: 0 }}
       animate={{ opacity: disabled ? 0.8 :   1, ...animations }}
      whileTap={{   scale: disabled ?   1 : 0.9 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
