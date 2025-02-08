import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Debounce } from '@/hooks/useDebounce';
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import css from './NavButton.module.css';

interface NavProps {
      index: number;
   callback: (path: string) => void;
  deferring: Debounce['deferring'];
  children?: React.ReactNode;
}

export default function NavButton({ index, callback, deferring, children }: NavProps) {
  const { pathname } = useLocation();
  const  path = (['/feed', '/social', 'ALERTS',       '/'] as const)[index];
  const  icon = ([  'rss',   'users',   'bell',    'user'] as const)[index];
  const label =  [ 'Feed',  'Social', 'Alerts', 'Profile']          [index];

  const isActive =
    pathname === path ||
    (pathname.startsWith('/post') && path === '/feed') ||
    (pathname.startsWith('/user') && path === '/social');

  const classes = `${css['nav-button']} ${
    isActive ? css['active'] : ''} ${
    isMobile ? css['mobile'] : ''
  }`;

  const isLandscape = window.matchMedia('(orientation: landscape)').matches && isMobile;
  const [x, y] = isLandscape ? [75, 0] : [0, 75];
  const opacity = deferring ? 0.6 : 1;
  const   delay = deferring ? 0   : 0.2 * index;

  return (
    <motion.button
      className={classes}
        onClick={() => callback(path)}
       disabled={deferring}
        initial={{ opacity: 0, y,    x }}
        animate={{ opacity,    y: 0, x: 0, transition: {     delay     } }}
           exit={{ opacity: 0,             transition: { duration: 0.8 } }}
    >
      <FontAwesomeIcon icon={icon} />
      {label}
      {children && children}
      {isActive && <motion.div layoutId='tab-indicator' className={css['active-tab']} />}
    </motion.button>
  );
}
