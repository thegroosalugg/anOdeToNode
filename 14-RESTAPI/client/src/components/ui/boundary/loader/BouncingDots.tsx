import { HTMLMotionProps, motion } from "motion/react";
import { CSSProperties } from "react";
import { Color } from "@/lib/types/colors";
import css from "./BouncingDots.module.css";

export default function BouncingDots({
     color = "accent",
      size = 15,
     style,
  ...props
}: { color?: Color; size?: number, style?: CSSProperties } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      {...props} // cannot change className or overwrite style
      className={css["bouncing-dots"]}
          style={{ "--background": `var(--${color})`, "--size": `${size}px`, ...style } as CSSProperties}
    >
      <div />
      <div />
      <div />
    </motion.div>
  );
}
