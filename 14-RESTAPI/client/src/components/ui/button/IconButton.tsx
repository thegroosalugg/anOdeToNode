import { HTMLMotionProps, motion } from 'motion/react';
import { ReactNode } from 'react';
import { Debounce } from '@/lib/hooks/useDebounce';
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { createVariants } from '@/lib/motion/animations';
import css from './IconButton.module.css';

interface ButtonProps extends HTMLMotionProps<"button"> {
  isActive?: boolean;
       icon: IconProp;
  deferring: Debounce['deferring'];
   children: ReactNode;
}

export default function IconButton({ isActive, icon, deferring, children, ...props }: ButtonProps) {
  let classes = css['icon-button'];
  if (isActive) classes += ` ${css['active']}`;

  const isLandscape = window.matchMedia('(orientation: landscape)').matches && isMobile;
  const      [x, y] = isLandscape ? [75, 0] : [0, 75];
  const     opacity =   deferring ?     0.6 : 1;
  const    variants = createVariants({ initial: { y, x }, animate: { y: 0, x: 0, opacity }});

  return (
    <motion.button
      className={classes}
       disabled={deferring}
     whileHover={{ opacity: 0.6 }}
     {...{ variants }}
     {...props}
    >
      <FontAwesomeIcon {...{ icon }} size='lg' />
      {children}
      {isActive && <motion.div layoutId='tab-indicator' className={css['active-tab']} />}
    </motion.button>
  );
}
