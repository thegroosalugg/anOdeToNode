import { ReactNode } from "react";
import { HTMLMotionProps, motion } from "motion/react";
import { createAnimations } from "@/lib/motion/animations";
import css from "./Heading.module.css";

export default function Heading({
  className = "",
   children,
   ...props
}: { className?: string; children: ReactNode } & HTMLMotionProps<"h1">) {
  return (
    <motion.h1
      className={`${css["heading"]} ${className}`}
      {...createAnimations()}
      {...props}
    >
      {children}
    </motion.h1>
  );
}
