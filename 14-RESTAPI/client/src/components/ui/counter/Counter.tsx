import { AnimatePresence, motion } from "motion/react";
import css from "./Counter.module.css";
import { createAnimations } from "@/lib/motion/animations";

export default function Counter({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span className={css["counter"]} {...createAnimations()}>
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
