import { motion, HTMLMotionProps } from "motion/react";
import css from "./Spinner.module.css";
import { Color } from "@/lib/types/colors";
import { CSSProperties } from "react";
import { createAnimations } from "@/lib/motion/animations";

const animations = createAnimations();

interface SpinnerProps {
   size?: number;
  color?: Color;
  style?: CSSProperties;
}

export default function Spinner({
      size = 80,
     color = "accent",
     style,
  ...props
}: SpinnerProps & HTMLMotionProps<"div">) {
  return (
    <motion.div
      {...animations}
      {...props} // cannot change className or overwrite style
      className={css["spinner"]}
      style={{ "--color": `var(--${color})`, "--size": `${size}px`, ...style } as CSSProperties}
    >
      <div />
      <div />
      <div />
      <div />
    </motion.div>
  );
}
