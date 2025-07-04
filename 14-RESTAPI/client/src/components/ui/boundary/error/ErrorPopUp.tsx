import { motion, HTMLMotionProps } from "framer-motion";
import css from "./ErrorPopUp.module.css";
import { createAnimations } from "@/lib/motion/animations";

interface ErrorPopUpProps extends HTMLMotionProps<"p"> {
   error: string;
  delay?: number;
}

const ErrorPopUp: React.FC<ErrorPopUpProps> = ({ error, delay, ...props }) => {
  const animations = createAnimations({
       initial: { scale: 0.5 },
       animate: { scale: 1 },
    transition: { delay },
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
