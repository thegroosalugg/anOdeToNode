import { ReactNode } from 'react';
import { motion, HTMLMotionProps, TargetAndTransition  } from 'motion/react';
import { isMobile } from 'react-device-detect';
import css from './Button.module.css';

export type HSL = [
         hue: number, // 0-360
  saturation: number, // 0-100
   lightness: number  // 0-100
 ];

export default function Button({
        hsl,
  animateEx = {},
   children,
   ...props
  }: {
           hsl: HSL;
    animateEx?: TargetAndTransition;
      children: ReactNode;
  } & HTMLMotionProps<'button'>) {
  const  [h, s, l] = hsl;
  const background = `hsl(${h}, ${s}%, ${l}%)`;
  const    onHover = `hsl(${h}, ${s}%, ${l - 10}%)`

  return (
    <motion.button
       className={css.button}
         initial={{ background, opacity: 0 }}
         animate={{ background, opacity: 1, ...animateEx }}
      whileHover={!isMobile ? { background: onHover } : {}}
        whileTap={{ scale: 0.9 }}
      transition={{ background: { duration: 0.5 } }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
