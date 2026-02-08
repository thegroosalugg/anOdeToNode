import { HTMLMotionProps, motion } from "motion/react";
import { Color } from "@/lib/types/colors";
import css from "./BouncingDots.module.css";

export default function BouncingDots({
     color = "accent",
      size = 15,
  ...props
}: { color?: Color; size?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      {...props}
      className={css["bouncing-dots"]}
          style={{ "--background": `var(--${color})`, "--size": `${size}px` } as React.CSSProperties}
    >
      <div />
      <div />
      <div />
    </motion.div>
  );
}
