import { motion } from "motion/react";
import css from "./PageWrapper.module.css";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
       className={css["page-wrapper"]}
         initial="hidden"
         animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
