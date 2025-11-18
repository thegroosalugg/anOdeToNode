import { createVariants } from "@/lib/motion/animations";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import PageWrapper from "@/components/ui/layout/PageWrapper";
import TextList from "@/components/ui/layout/TextList";
import css from "./StaticPages.module.css";

const variants = createVariants();

export default function AboutPage() {
  return (
    <PageWrapper>
      <motion.h1 className={css["header"]}    {...{ variants }}>About</motion.h1>
      <motion.p  className={css["paragraph"]} {...{ variants }}>
        I'm a junior web developer based in Berlin. This demo app is a full-stack social
        platform built with React 18, Express 4, and Mongoose 8. It's styled using CSS
        Modules and animated with Framer Motion. I implemented real-time features,
        authentication, and responsive UI to demonstrate best practices in modern web
        development.
      </motion.p>
      <TextList
        items={[
          "Socket.IO live updates - live chat & notification alerts",
          "JWT authentication - via access & refresh tokens",
          "Add/manage friends. Respond to posts. Image upload (FS).",
          "Responsive design for all devices. Light/Dark mode",
        ]}
      >
        Key Features:
      </TextList>
      <TextList items={["React 18", "Express 4", "Mongoose 8"]}>
        Built With:
      </TextList>
      <motion.div className={css["link"]} {...{ variants }}>
        <Link to="/terms">See instructions for using this site</Link>
      </motion.div>
    </PageWrapper>
  );
}
