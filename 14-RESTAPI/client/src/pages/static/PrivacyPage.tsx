import { createVariants } from "@/lib/motion/animations";
import { motion } from "motion/react";
import PageWrapper from "@/components/ui/layout/PageWrapper";
import css from "./StaticPages.module.css";

const variants = createVariants();

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <motion.h1 className={css["header"]} {...{ variants }}>
        Privacy Policy
      </motion.h1>
      <motion.p className={css["paragraph"]} {...{ variants }}>
        This app collects minimal technical data (page URL, screen size, browser user agent, and timestamp) for learning
        purposes only. The data is not retained long-term and is not shared with any third parties.
      </motion.p>
    </PageWrapper>
  );
}
