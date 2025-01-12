import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Auth } from '@/pages/RootLayout';
import css from './NavButton.module.css';

interface NavProps {
          path: string;
         navFn: (path: string) => void;
  isDebouncing: boolean;
         user?: Auth['user'];
}

export default function NavButton({ path, navFn, isDebouncing, user }: NavProps) {
  const { pathname } = useLocation();
  const   isActive   = pathname === path || (pathname.startsWith('/post') && path === '/');
  const   classes    = `${css['nav-button']} ${
    isActive ? css['active'] : ''} ${
    isMobile ? css['mobile'] : ''
  }`;

  const labels: Record<string, string> = {
           '/': 'Feed',
    '/account': user ? 'Profile' : 'Login',
  };

  return (
    <button className={classes} onClick={() => navFn(path)} disabled={isDebouncing}>
      {labels[path]}
      {isActive && <motion.div layoutId='tab-indicator' className={css['active-tab']} />}
    </button>
  );
}
