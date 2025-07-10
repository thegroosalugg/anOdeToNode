import { HTMLMotionProps, motion } from 'motion/react';
import { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { createVariants } from '@/lib/motion/animations';
import css from './IconButton.module.css';

interface ButtonProps extends HTMLMotionProps<"button"> {
        icon: IconProp;
   isActive?: boolean;
   layoutId?: string;
       size?: SizeProp;
    children: ReactNode;
}

export default function IconButton({
       icon,
   isActive,
   layoutId,
        size = "lg",
   children,
    ...props
}: ButtonProps) {
  let classes = css['icon-button'];
  if (isActive) classes += ` ${css['active']}`;

  const isLandscape = window.matchMedia('(orientation: landscape)').matches && isMobile;
  const      [x, y] = isLandscape ? [75, 0] : [0, -75];
  const    variants = createVariants({ initial: { y, x }, animate: { y: 0, x: 0 }});

  return (
    <motion.button
      className={classes}
      whileHover={{ opacity: 0.6 }}
      {...{ variants }}
      {...props}
    >
      <FontAwesomeIcon {...{ icon, size }} />
      {children}
      {isActive && layoutId && (
        <motion.div {...{ layoutId }} className={css["active-tab"]} />
      )}
    </motion.button>
  );
}
