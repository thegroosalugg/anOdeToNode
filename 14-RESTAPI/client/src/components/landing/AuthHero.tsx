import { motion } from "motion/react";
import { createVariants } from "@/lib/motion/animations";
import css from "./AuthHero.module.css";

const variants = createVariants();

export default function AuthHero({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className={css["auth-hero"]} exit={{ opacity: 0, transition: { duration: 0.8 } }}>
      <motion.section
        className={css["auth-hero-banner"]}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.25, delayChildren: 0.8 }}
      >
        <motion.h1 {...{ variants }}>Get Started</motion.h1>
        <motion.p {...{ variants }}>
          This is a full-stack social media demo with persistent authentication. Create a dummy account to explore all
          features.
        </motion.p>
      </motion.section>
      <section className={css["auth-hero-content-wrapper"]}>{children}</section>
    </motion.div>
  );
}
