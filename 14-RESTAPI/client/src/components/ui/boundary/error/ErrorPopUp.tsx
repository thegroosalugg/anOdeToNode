import { motion, HTMLMotionProps } from "framer-motion";
import { createAnimations } from "@/lib/motion/animations";
import css from "./ErrorPopUp.module.css";

interface ErrorPopUp extends HTMLMotionProps<"p"> {
   error: string;
  delay?: number;
}

const ErrorPopUp: React.FC<ErrorPopUp> = ({ error, delay = 0, ...props }) => {
  const animations = createAnimations({
       initial: { scale: 0.5 },
       animate: { scale:   1 },
    transition: { delay      },
  });

  return (
    <motion.p
      className={css["error-pop-up"]}
      {...animations}
      {...props}
    >
      {error}
    </motion.p>
  );
};

export default ErrorPopUp;
