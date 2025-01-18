import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Auth } from '@/pages/RootLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import css from './NavButton.module.css';

interface NavProps {
       path: string;
      navFn: (path: string) => void;
  deferring: boolean;
      user?: Auth['user'];
}

export default function NavButton({ path, navFn, deferring, user }: NavProps) {
  const { pathname } = useLocation();
  const   isActive   = pathname === path || (pathname.startsWith('/post') && path === '/');
  const   classes    = `${css['nav-button']} ${
    isActive ? css['active'] : ''} ${
    isMobile ? css['mobile'] : ''
  }`;

  const labels: Record<string, string> = {
           '/': 'Feed',
     '/social': 'Social',
    '/account': user ? 'Profile' : 'Login',
  };

  const icons: Record<string, IconProp> = {
           '/': 'rss',
     '/social': 'users',
    '/account': 'user',
  };

  return (
    <button className={classes} onClick={() => navFn(path)} disabled={deferring}>
      <FontAwesomeIcon icon={icons[path]} />
      {labels[path]}
      {isActive && <motion.div layoutId='tab-indicator' className={css['active-tab']} />}
    </button>
  );
}
