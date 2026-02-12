import { createVariants } from "@/lib/motion/animations";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import PageWrapper from "@/components/ui/layout/PageWrapper";
import TextList from "@/components/ui/layout/TextList";
import css from "./StaticPages.module.css";

const variants = createVariants();

export default function AboutPage() {
  return (
    <PageWrapper>
      <motion.h1 className={css["header"]} {...{ variants }}>
        About
      </motion.h1>
      <motion.p className={css["paragraph"]} {...{ variants }}>
        I'm a full-stack developer based in Berlin. I built this social media demo to explore features like real-time
        chat via Socket.IO, JWT authentication, query-based pagination, and user relationship management. All features
        and logic were designed from scratch.
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
      <TextList items={["React 18", "Express 4", "Mongoose 8"]}>Tech Stack:</TextList>
      <motion.div className={css["link"]} {...{ variants }}>
        <Link to={ROUTES.terms}>See instructions for using this site</Link>
      </motion.div>
      <motion.div className={css["link"]} {...{ variants }} style={{ marginTop: "0.25rem" }}>
        <a href={import.meta.env.VITE_PORTFOLIO_URL} target="_blank">
          More from me
        </a>
      </motion.div>
    </PageWrapper>
  );
}
