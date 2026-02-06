import { motion, HTMLMotionProps } from 'motion/react';
import css from './Loader.module.css';
import { Color } from '@/lib/types/colors';

interface LoaderProps {
   size?: "xs" | "sm";
  color?: Color;
}

export default function Loader({
      size,
     color,
  ...props
}: LoaderProps & HTMLMotionProps<'div'>) {
  let classes = css["loader"];
  if (size)  classes += ` ${css[size]}`;

  return (
    <motion.div
      {...props}
       className={classes}
           style={{ "--color": `var(--${color})` } as React.CSSProperties}
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
