import { AnimatePresence, motion } from 'motion/react';
import css from './Counter.module.css';

export default function Counter({ count, scale = 1 }: { count: number; scale?: number }) {
  const animation = {
      style: {   scale    },
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
