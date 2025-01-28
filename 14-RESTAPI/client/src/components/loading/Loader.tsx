import { motion, HTMLMotionProps } from 'motion/react';
import css from './Loader.module.css';

export default function Loader({
     small = false,
  ...props
}: { small?: boolean } & HTMLMotionProps<'div'>) {
  const classes = `${css['loader']} ${small ? css['small'] : ''}`;

  return (
    <motion.div
      {...props}
       className={classes}
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
