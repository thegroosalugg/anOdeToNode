import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Debounce } from '@/hooks/useDebounce';
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NAV_CONFIG } from './NavConfig';
import css from './NavButton.module.css';

interface NavProps {
       path: '/feed' | '/social' | '/';
      navFn: (path: string) => void;
  deferring: Debounce['deferring'];
}

export default function NavButton({ path, navFn, deferring }: NavProps) {
  const { pathname } = useLocation();

  const isActive =
    pathname === path ||
    (pathname.startsWith('/post') && path === '/feed') ||
    (pathname.startsWith('/user') && path === '/social');

  const classes = `${css['nav-button']} ${
    isActive ? css['active'] : ''} ${
    isMobile ? css['mobile'] : ''
  }`;
  
  const { label, icon, delay } = NAV_CONFIG[path];

  const isLandscape = window.matchMedia('(orientation: landscape)').matches && isMobile;
  const [x, y] = isLandscape ? [50, 0] : [0, 50];

  return (
    <motion.button
      className={classes}
        onClick={() => navFn(path)}
       disabled={deferring}
        initial={{ opacity: 0, y,    x }}
        animate={{ opacity: 1, y: 0, x: 0, transition: {    delay      } }}
           exit={{ opacity: 0,             transition: { duration: 0.8 } }}
    >
      <FontAwesomeIcon icon={icon} />
      {label}
      {isActive && <motion.div layoutId='tab-indicator' className={css['active-tab']} />}
    </motion.button>
  );
}
