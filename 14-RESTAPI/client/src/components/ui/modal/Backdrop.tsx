import { HTMLMotionProps, motion } from "motion/react";
import { createAnimations } from "@/lib/motion/animations";
import css from "./Backdrop.module.css";

export default function Backdrop({
  smHidden,
      open,
  ...props
}: { open: boolean ,smHidden?: boolean } & HTMLMotionProps<"div">) {
  const animate = { backgroundColor: `rgba(0, 0, 0, ${open ? 0.75 : 0})` };
  const animations = createAnimations({ animate });
  let classes = css["backdrop"];
  if (smHidden) classes += ` ${css["hidden"]}`;

  return (
    <motion.div
      {...animations}
      {...props}
       className={classes}
           style={{   pointerEvents: open ? "auto" : "none"   }}
      whileHover={{ backgroundColor: "rgba(10, 10, 10, 0.55)" }}
    />
  );
}
