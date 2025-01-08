import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import User from '@/models/User';
import NavButton from './NavButton';
import css from './NavBar.module.css';

export default function NavBar({ user }: { user: User }) {
  const navigate = useNavigate();
  const { isDebouncing, throttleFn } = useDebounce()

  function navTo(path: string) {
    throttleFn(() => navigate(path), 1200);
  }

  return (
    <nav className={css['nav']}>
      <h1>Friendface</h1>
      <NavButton path='/'        navFn={navTo} isDebouncing={isDebouncing} />
      <NavButton path='/account' navFn={navTo} isDebouncing={isDebouncing} user={user} />
    </nav>
  );
}
