import { motion } from "motion/react";
import css from "./FlashTransition.module.css";

export default function FlashTransition({ trigger }: { trigger: React.Key | null | undefined }) {
  return (
    <motion.div
       className={css["flash-transition"]}
             key={trigger}
         initial={{ clipPath: "inset(0 0 0 0)" }}
         animate={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    />
  );
}
