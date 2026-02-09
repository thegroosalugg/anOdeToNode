import { ApiError } from "@/lib/http/fetchData";
import { AnimatePresence, motion } from "motion/react";
import { createAnimations } from "@/lib/motion/animations";
import css from "./Error.module.css";
import ResizeDiv from "../../layout/ResizeDiv";

const initial = { scale: 0.8 };
const animate = { scale:   1 };
const animations = createAnimations({ initial, animate });

export default function Error({ error }: { error: ApiError | null }) {
  return (
    <ResizeDiv>
      <AnimatePresence>
        {error && (
          <motion.p className={css["error"]} {...animations}>
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </ResizeDiv>
  );
}
