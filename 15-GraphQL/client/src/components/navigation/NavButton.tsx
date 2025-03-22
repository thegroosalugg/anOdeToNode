import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Debounce } from '@/hooks/useDebounce';
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import css from './NavButton.module.css';

interface NavProps {
       path: string;
      navTo: (path: string) => void;
  deferring: Debounce['deferring'];
  children?: React.ReactNode;
}

export default function NavButton({ path, navTo, deferring, children }: NavProps) {
  const { pathname } = useLocation();
  const isActive = pathname === path;
  const  classes = `${css['nav-button']} ${isActive ? css['active'] : ''}`;

  const isLandscape = window.matchMedia('(orientation: landscape)').matches && isMobile;
  const      [x, y] = isLandscape ? [75, 0] : [0, 75];
  const     opacity =   deferring ?     0.6 : 1;

  const icons = {
    '/': 'user',
  } as const;

  const label = {
    '/': 'Profile',
  }[path];

  return (
    <motion.button
      className={classes}
        onClick={() => navTo(path)}
       disabled={deferring}
        initial={{ opacity: 0, y,    x    }}
        animate={{ opacity,    y: 0, x: 0 }}
           exit={{ opacity: 0,             transition: { duration: 0.8 } }}
     whileHover={{ opacity: 0.6 }}
    >
      <FontAwesomeIcon icon={icons[path as keyof typeof icons]} size='xl' />
      {label}
      {children && children}
      {isActive && <motion.div layoutId='tab-indicator' className={css['active-tab']} />}
    </motion.button>
  );
}
