import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createAnimations, createVariants } from "@/lib/motion/animations";
import BouncingDots from "../ui/boundary/loader/BouncingDots";
import css from "./SplashScreen.module.css";

const variants = createVariants();
const animations = createAnimations();

export default function SplashScreen() {
  const [index, setIndex] = useState(0);

  const messages = [
    "Please wait while Render's server wakes",
    "This should take approximately 90 seconds"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  });

  return (
    <motion.div className={css["splash-screen"]} exit={{ opacity: 0, transition: { duration: 0.5 } }}>
      <motion.div
         className={css["splash-content"]}
           initial="hidden"
           animate="visible"
        transition={{ staggerChildren: 0.25 }}
      >
        <motion.h1 {...{ variants }}>FriendFace</motion.h1>
        <AnimatePresence mode="wait">
          <motion.p key={index} {...{ variants }} {...animations}>
            {messages[index]}
          </motion.p>
        </AnimatePresence>
        <BouncingDots {...{ variants }} />
      </motion.div>
    </motion.div>
  );
}
