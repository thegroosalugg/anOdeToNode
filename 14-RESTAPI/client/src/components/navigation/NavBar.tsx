import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { Auth } from '@/pages/RootLayout';
import NavButton from './NavButton';
import css from './NavBar.module.css';

export default function NavBar({ user }: Auth) {
  const navigate = useNavigate();
  const { deferring, deferFn } = useDebounce();

  function navTo(path: string) {
    deferFn(() => navigate(path), 1200);
  }

  return (
    <nav className={css['nav']}>
      <h1>Friendface</h1>
      <NavButton path='/'        navFn={navTo} deferring={deferring} />
      <NavButton path='/social'  navFn={navTo} deferring={deferring} />
      <NavButton path='/account' navFn={navTo} deferring={deferring} user={user} />
    </nav>
  );
}
