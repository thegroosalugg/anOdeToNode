import { AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { Auth } from '@/pages/RootLayout';
import NavButton from './NavButton';
import css from './NavBar.module.css';

export default function NavBar({ user, setUser }: Auth) {
  const navigate = useNavigate();
  const { deferring, deferFn } = useDebounce();

  function navTo(path: string) {
    deferFn(() => navigate(path), 1200);
  }

  return (
    <nav className={css['nav']}>
      <h1>
        <span>
          Friendface {/* visible in portrait, display: none in landscape */}
        </span>
        <span>
          <FontAwesomeIcon icon='f' /> {/* vice versa */}
        </span>
      </h1>
      <AnimatePresence>
        <NavButton  {...{  path: '/', deferring, navTo }} />
      </AnimatePresence>
    </nav>
  );
}
