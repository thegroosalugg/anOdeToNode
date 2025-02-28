import { AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { Auth } from '@/pages/RootLayout';
import NavButton from './NavButton';
import Notifications from '../notifications/Notifications';
import ChatMenu from '../chat/ChatMenu';
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
        {user &&
          Array.from({ length: 5 }, (_, index) =>
            index === 2 ? (
              <Notifications key={index} {...{ user, setUser }} />
            ) : index === 3 ? (
              <ChatMenu      key={index} {...{ user, setUser }} />
            ) : (
              <NavButton     key={index}
                {...{ index, deferring, callback: (path) => navTo(path) }}
              />
            )
          )}
      </AnimatePresence>
    </nav>
  );
}
