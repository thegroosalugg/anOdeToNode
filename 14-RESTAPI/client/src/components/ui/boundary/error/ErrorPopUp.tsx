import { motion, HTMLMotionProps } from "framer-motion";
import { createAnimations } from "@/lib/motion/animations";
import css from "./ErrorPopUp.module.css";

interface ErrorPopUp extends HTMLMotionProps<"p"> {
   error: string;
  delay?: number;
}

const ErrorPopUp: React.FC<ErrorPopUp> = ({ error, delay = 0, ...props }) => {
  const animations = createAnimations({
    initial: {
             scale: 0.5,
        whiteSpace: "nowrap",
          overflow: "hidden",
      textOverflow: "ellipsis",
    },
       animate: { scale: 1 },
    transition: { scale: { delay }, opacity: { delay } },
  });

  const mouseEvents = { whiteSpace: "normal", overflow: "visible" };

  return (
    <motion.p
       className={css["error-pop-up"]}
      whileHover={mouseEvents}
        whileTap={mouseEvents}
      {...animations}
      {...props}
    >
      {error}
    </motion.p>
  );
};

export default ErrorPopUp;
