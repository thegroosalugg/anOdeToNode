import { FetchError } from "@/lib/types/common";
import { motion } from "motion/react";
import { createAnimations } from "@/lib/motion/animations";
import css from "./Error.module.css";

const initial = { scale: 0.8 };
const animate = { scale: 1 };
const animations = createAnimations({ initial, animate });

export default function Error({ error }: { error: FetchError }) {
  return (
    <motion.p className={css["error"]} {...animations}>
      {error.message}
    </motion.p>
  );
}
