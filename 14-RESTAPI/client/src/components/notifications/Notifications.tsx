import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import { Auth } from '@/pages/RootLayout';
import { captainsLog } from '@/util/captainsLog';
import css from '../navigation/NavButton.module.css';

export default function Notifications({ user, setUser }: Auth) {

  useEffect(() => {
    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog(-100, 15, ['NAV: Socket connected']));

    socket.on(`peer:${user?._id}:update`, (updated) => {
      captainsLog(-100, 15, ['NAV: UPDATE', updated]);
      setUser(updated);
    });

    return () => {
      socket.off('connect');
      socket.off(`peer:${user?._id}:update`);
      socket.disconnect();
    };
  }, [user?._id, setUser]);

  return (
    <button className={css['nav-button']}>
      <FontAwesomeIcon icon='bell' />
      <span>Alerts</span>
    </button>
  );
}
