import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import css from './NavButton.module.css';

const labels = {
  '/': 'Feed',
};

interface NavProps {
          path: keyof typeof labels;
         navFn: (path: string) => void;
  isDebouncing: boolean;
}

export default function NavButton({ path, navFn, isDebouncing }: NavProps) {
  const { pathname } = useLocation();
  const   isActive   = pathname === path;
  const   classes    = `${css['nav-button']} ${
    isActive ? css['active'] : ''} ${
    isMobile ? css['mobile'] : ''
  }`;

  return (
    <button className={classes} onClick={() => navFn(path)} disabled={isDebouncing}>
      {labels[path]}
      {isActive && <motion.div layoutId='tab-indicator' className={css['active-tab']} />}
    </button>
  );
}
