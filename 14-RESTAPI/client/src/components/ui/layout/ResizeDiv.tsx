import { HTMLMotionProps, motion } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ResizeDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

export default function ResizeDiv({ children, ...props }: ResizeDivProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const observedHeight = entries[0].contentRect.height;
      setHeight(observedHeight);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <motion.div {...props} animate={{ height, transition: { height: { duration: 0.5 } } }}>
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}
