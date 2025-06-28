import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Auth } from '@/lib/types/auth';
import NavButton from './NavButton';
import Notifications from '../../notifications/Notifications';
import ChatMenu from '../../chat/ChatMenu';
import css from './NavBar.module.css';
import { ChatProvider } from '@/components/chat/context/ChatProvider';

export default function NavBar({ user, setUser }: Auth) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { deferring, deferFn } = useDebounce();
  const background = `linear-gradient(to right, ${
    pathname === '/' ? '#434343, #757575' : '#12a1a1, #379d9d'
  })`;

  function navTo(path: string) {
    deferFn(() => navigate(path), 1200);
  }

  return (
    <motion.nav className={css['nav']} animate={{ background, transition: { duration: 0.5 } }}>
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
              <ChatProvider key={index} {...{ user, setUser }}>
                <ChatMenu />
              </ChatProvider>
            ) : (
              <NavButton
                key={index}
                {...{ index, deferring, callback: (path) => navTo(path) }}
              />
            )
          )}
      </AnimatePresence>
    </motion.nav>
  );
}
