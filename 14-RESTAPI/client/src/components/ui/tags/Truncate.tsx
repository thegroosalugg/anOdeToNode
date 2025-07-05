import { HTMLMotionProps, motion } from "motion/react";
import { ReactNode } from "react";

interface Truncate extends HTMLMotionProps<"span"> {
 className?: string;
   children: ReactNode;
}

export default function Truncate({ className = "", children, ...props }: Truncate) {
  return (
    <motion.span className={`truncate ${className}`} {...props}>
      {children}
    </motion.span>
  );
}
