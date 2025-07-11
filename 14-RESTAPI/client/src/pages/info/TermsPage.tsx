import { createVariants } from "@/lib/motion/animations";
import { motion } from "motion/react";
import css from "./TermsPage.module.css";

const variants = createVariants();

export default function TermsPage() {
  return (
    <motion.div
      className={css["terms"]}
         initial="hidden"
         animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      <motion.h1 {...{ variants }}>Terms and conditions</motion.h1>
      <motion.p  {...{ variants }}>
        This demo app is built purely for learning and showcasing purposes. It’s not a real
        service, so please don’t rely on it for anything important. Feel free to explore and
        have fun!
      </motion.p>
    </motion.div>
  );
}
