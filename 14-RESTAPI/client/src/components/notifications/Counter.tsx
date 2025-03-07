import { AnimatePresence, motion } from 'motion/react';
import css from './Counter.module.css';

export default function Counter({
  count,
    pos = [20, -7, -5],
}: {
  count: number;
   pos?: [number, number, number];
}) {
  const [width, right, top] = pos;
  const animation = {
      style: { width, right, top, fontSize: width * 0.6 },
    initial: { opacity: 0 },
    animate: { opacity: 1 },
       exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span className={css['counter']} {...animation}>
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
