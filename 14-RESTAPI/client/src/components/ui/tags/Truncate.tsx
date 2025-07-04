import { HTMLMotionProps, motion } from "motion/react";
import { ReactNode } from "react";

interface Truncate extends HTMLMotionProps<"span"> {
  children: ReactNode;
}

export default function Truncate({ children, ...props }: Truncate) {
  return (
    <motion.span className="truncate" {...props}>
      {children}
    </motion.span>
  );
}
