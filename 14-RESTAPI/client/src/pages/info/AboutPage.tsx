import { createVariants } from "@/lib/motion/animations";
import { motion } from "motion/react";
import css from "./AboutPage.module.css";

const variants = createVariants();

export default function AboutPage() {
  return (
    <motion.div
      className={css["about"]}
        initial="hidden"
        animate="visible"
     transition={{ staggerChildren: 0.2 }}
    >
      <motion.h1 {...{ variants }}>
        About
      </motion.h1>

      <motion.p {...{ variants }}>
        I'm a junior web developer based in Berlin. This demo app was built with React 18, Express 4, and Mongoose 8. It’s styled using CSSModules and animated with Framer Motion.
      </motion.p>

      <motion.h2 {...{ variants }}>
        Key Features:
      </motion.h2>
      <motion.ul {...{ variants }}>
        <li>Socket.IO live updates - live chat & notification alerts</li>
        <li>JWT authentication - via access & refresh tokens</li>
        <li>Add/manage friends. Respond to posts. Image upload (FS).</li>
        <li>Responsive design for all devices. Light/Dark mode</li>
      </motion.ul>

      <motion.h2 {...{ variants }}>
        Built With:
      </motion.h2>
      <motion.ul {...{ variants }}>
        <li>React 18</li>
        <li>Express 4</li>
        <li>Mongoose 8</li>
      </motion.ul>
    </motion.div>
  );
}
