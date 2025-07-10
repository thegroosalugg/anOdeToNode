import { ReactNode } from "react";
import { motion, HTMLMotionProps, TargetAndTransition } from "motion/react";
import css from "./Button.module.css";

export default function Button({
       color = "var(--bg)",
  background = "var(--accent)",
      border,
  animations = {},
    children,
    ...props
}: {
         color?: string;
    background?: string;
        border?: boolean | string;
    animations?: TargetAndTransition;
       children: ReactNode;
} & HTMLMotionProps<"button">) {
  const borderColor = typeof border === "boolean" ? color : border;

  return (
    <motion.button
       className={css["button"]}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1, color, background, borderColor, ...animations }}
        whileTap={{ scale: 0.9 }}
      transition={{ background: { duration: 0.5 } }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
