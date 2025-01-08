import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import User from '@/models/User';
import css from './NavButton.module.css';

const labels = (path: string, user?: User) => {
  return {
         '/': 'Feed',
  '/account':  user ? 'Profile' : 'Login'
  }[path];
};

interface NavProps {
          path: string;
         navFn: (path: string) => void;
  isDebouncing: boolean;
         user?: User
}

export default function NavButton({ path, navFn, isDebouncing, user }: NavProps) {
  const { pathname } = useLocation();
  const   isActive   = pathname === path || (pathname.startsWith('/post') && path === '/');
  const   classes    = `${css['nav-button']} ${
    isActive ? css['active'] : ''} ${
    isMobile ? css['mobile'] : ''
  }`;

  return (
    <button className={classes} onClick={() => navFn(path)} disabled={isDebouncing}>
      {labels(path, user)}
      {isActive && <motion.div layoutId='tab-indicator' className={css['active-tab']} />}
    </button>
  );
}
