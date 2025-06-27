import { HTMLMotionProps, motion } from "motion/react";
import { createAnimations } from "@/lib/motion/animations";
import css from "./Backdrop.module.css";

export default function Backdrop({
  smHidden,
    isOpen,
  ...props
}: { isOpen: boolean, smHidden?: boolean } & HTMLMotionProps<"div">) {
  const initial = { backgroundColor: "rgba(0, 0, 0, 0)" };
  const animate = { backgroundColor: `rgba(0, 0, 0, ${isOpen ? 0.75 : 0})` };
  const animations = createAnimations({ initial, animate });
  let classes = css["backdrop"];
  if (smHidden) classes += ` ${css["hidden"]}`;

  return (
    <motion.div
      {...animations}
      {...props}
       className={classes}
           style={{  pointerEvents: isOpen ? "auto" : "none"  }}
      whileHover={{ backgroundColor: "rgba(10, 10, 10, 0.55)" }}
    />
  );
}
