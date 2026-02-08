import { motion, HTMLMotionProps } from 'motion/react';
import css from './Spinner.module.css';
import { Color } from '@/lib/types/colors';

interface SpinnerProps {
   size?: "xs" | "sm";
  color?: Color;
}

export default function Spinner({ size, color = "accent", ...props }: SpinnerProps & HTMLMotionProps<"div">) {
  let classes = css["spinner"];
  if (size) classes += ` ${css[size]}`;

  return (
    <motion.div
      {...props}
      className={classes}
        style={{ "--color": `var(--${color})` } as React.CSSProperties}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
         exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div />
      <div />
      <div />
      <div />
    </motion.div>
  );
}
