import { motion } from 'framer-motion';
import css from './Loader.module.css';

export default function Loader() {
  return (
    <motion.div
       className={css['loader']}
         initial={{ scale: 0, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
      transition={{    duration: 0.8     }}
    >
      <div />
      <div />
      <div />
      <div />
    </motion.div>
  );
}
