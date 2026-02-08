import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createVariants } from "@/lib/motion/animations";
import BouncingDots from "../ui/boundary/loader/BouncingDots";
import css from "./SplashScreen.module.css";

const variants = createVariants()

export default function SplashScreen() {
  const [index, setIndex] = useState(0);

  const messages = [
    "Please wait while Render's server wakes",
    "This should take approximatels 90 seconds"
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
        <motion.p key={index} {...{ variants }} animate={{ opacity: [0, 1], transition: { duration: 1 } }}>
          {messages[index]}
        </motion.p>
        <BouncingDots {...{ variants }} />
      </motion.div>
    </motion.div>
  );
}
