import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import css from './Button.module.css';

type HSL = [
         hue: number, // 0-360
  saturation: number, // 0-100
   lightness: number  // 0-100
 ];

export default function Button({
       hsl,
  children,
  ...props
}: { hsl: HSL, children: ReactNode } & HTMLMotionProps<'button'>) {
  const [h, s, l] = hsl;
  const background = `hsl(${h}, ${s}%, ${l}%)`;
  const    onHover = `hsl(${h}, ${s}%, ${l - 10}%)`

  return (
    <motion.button
       className={css.button}
         animate={{ background }}
      whileHover={!isMobile ? { background: onHover } : {}}
        whileTap={{ scale: 0.9 }}
      transition={{ background: { duration: 0.5 } }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
