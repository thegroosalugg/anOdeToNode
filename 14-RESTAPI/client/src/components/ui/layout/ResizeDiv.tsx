import { HTMLMotionProps, motion } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ResizeDivProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
  className?: string;
}

export default function ResizeDiv ({
  className,
   children,
   ...props
}: ResizeDivProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <motion.div
      {...{ className }}
      animate={{ height, transition: { height: { duration: 0.5 } } }}
      {...props}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};
