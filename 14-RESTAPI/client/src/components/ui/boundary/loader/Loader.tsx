import { motion, HTMLMotionProps } from 'motion/react';
import css from './Loader.module.css';

interface LoaderProps {
   size?: "xs" | "sm";
  color?: "bg" | "white";
}

export default function Loader({
      size,
     color,
  ...props
}: LoaderProps & HTMLMotionProps<'div'>) {
  let classes = css["loader"];
  if (size)  classes += ` ${css[size]}`;
  if (color) classes += ` ${css[color]}`;

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
