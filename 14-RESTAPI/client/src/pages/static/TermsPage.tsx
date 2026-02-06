import { createVariants } from "@/lib/motion/animations";
import { motion } from "motion/react";
import PageWrapper from "@/components/ui/layout/PageWrapper";
import TextList from "@/components/ui/layout/TextList";
import css from "./StaticPages.module.css";

const variants = createVariants();

export default function TermsPage() {
  return (
    <PageWrapper>
      <motion.h1 className={css["header"]}    {...{ variants }}>
        Terms and conditions
      </motion.h1>
      <motion.p  className={css["paragraph"]} {...{ variants }}>
        This demo app is built purely for learning and showcasing purposes. It’s not a real
        service, so please don’t rely on it for anything important. Feel free to explore and
        have fun!
      </motion.p>
      <TextList
        items={[
          "Render's server takes about 90 seconds to wake up",
          "To use the app you must create a dummy account",
          "Do not use real information, just make it up",
          "Passwords are hashed with bcrypt",
          "Live message function is not hashed; do not write anything sensitive",
          "Image uploads are stored on the file system with Multer and are automatically removed when the server sleeps."
        ]}
      >
        How to use
      </TextList>
    </PageWrapper>
  );
}
