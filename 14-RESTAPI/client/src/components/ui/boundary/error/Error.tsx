import { FetchError } from '@/lib/types/common';
import { motion } from 'motion/react';
import css from './Error.module.css';

export default function Error({ error }: { error: FetchError }) {
  return (
    <motion.p
       className={css['error']}
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: 1, scale:   1 }}
            exit={{ opacity: 0, scale: 0.5 }}
      transition={{      duration: 0.5     }}
    >
      {error.message}
    </motion.p>
  );
}
