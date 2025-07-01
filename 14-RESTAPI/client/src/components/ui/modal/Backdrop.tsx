import { HTMLMotionProps, motion } from "motion/react";
import { createAnimations } from "@/lib/motion/animations";
import css from "./Backdrop.module.css";

interface Backdrop extends HTMLMotionProps<"div"> {
         open: boolean;
      zIndex?: number;
  shouldHide?: boolean;
}

export default function Backdrop({ open, shouldHide, zIndex = 10, ...props }: Backdrop) {
  const initial = { backgroundColor: "rgba(0, 0, 0, 0)" };
  const animate = { backgroundColor: `rgba(0, 0, 0, ${open ? 0.75 : 0})` };
  const animations = createAnimations({ initial, animate });
  let classes = css["backdrop"];
  if (shouldHide) classes += ` ${css["hidden"]}`;

  return (
    <motion.div
      {...animations}
      {...props}
       className={classes}
           style={{ pointerEvents: open ? "auto" : "none", zIndex }}
      whileHover={{ backgroundColor: "rgba(10, 10, 10, 0.55)" }}
    />
  );
}
