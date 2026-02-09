import { ApiError } from "@/lib/http/fetchData";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import { createAnimations } from "@/lib/motion/animations";
import ResizeDiv from "../../layout/ResizeDiv";
import css from "./Error.module.css";

const initial = { scale: 0.8 };
const animate = { scale:   1 };
const animations = createAnimations({ initial, animate });

export default function Error({ error, ...props }: { error: ApiError | null } & HTMLMotionProps<"p">) {
  const { message } = error ?? {};
  return (
    // hide ResiseDiv when no message; flex gap creates space unless element fully hidden
    <ResizeDiv style={{ display: message ? "block" : "none" }}>
      <AnimatePresence>
        {message && (
          <motion.p className={css["error"]} {...animations} {...props}>
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </ResizeDiv>
  );
}
