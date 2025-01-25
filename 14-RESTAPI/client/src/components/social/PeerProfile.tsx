import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import { PEER_CONFIG } from './peerProfileConfig';
import { Auth } from '@/pages/RootLayout';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import Button, { HSL } from '../button/Button';
import Loader from '../loading/Loader';
import { captainsLog } from '@/util/captainsLog';
import css from './PeerProfile.module.css';

export default function PeerProfile({
     user,
  setUser,
     peer,
}: Pick<Auth, 'user' | 'setUser'> & { peer: User }) {
  const { isLoading, reqHandler } = useFetch();
  const { deferring,    deferFn } = useDebounce();
  const {   _id, name, surname  } = peer;

  const  connection = user?.friends.find((friend) => friend.user === _id);
  const    isFriend = connection?.status === 'accepted';
  const isRequested = connection?.status === 'received';
  const { text, icon, hsl, action } = PEER_CONFIG[connection?.status || 'none'];
  const       color = connection ?     '#ffffff' : 'var(--team-green)';
  const borderColor = connection ? 'transparent' : 'var(--team-green)';

  async function clickHandler() {
    if (!isFriend) {
      deferFn(async () => {
        await reqHandler({ url: `social/${_id}/${action}`, method: 'POST' });
      }, 1000);
    }
  }

  useEffect(() => {
    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog(-100, 150, ['PEER PROFILE: Socket connected']));

    socket.on(`peer:${_id}:${user?._id}:update`, (updated) => {
      captainsLog(-100, 150, ['PEER PROFILE: UPDATE', updated]);
      setUser(updated);
    })

    return () => {
      socket.off('connect');
      socket.off(`peer:${_id}:${user?._id}:update`);
      socket.disconnect();
    }
  }, [_id, user?._id, setUser]);

  return (
    <motion.section
      className={css['peer-profile']}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.5 } }}
    >
      <div className={css['profile-pic']}>
        <div>
          <ProfilePic user={peer} />
          <h2>
            {name} {surname}
          </h2>
        </div>
        <Button
               hsl={hsl as HSL}
           onClick={clickHandler}
             style={{ color, borderColor }}
          disabled={deferring}
         >
          {isLoading ? (
            <Loader small />
          ) : (
            <span>
              {text}
              <FontAwesomeIcon icon={icon} size='xs' />
            </span>
          )}
        </Button>
        {(isRequested || isFriend) && (
          <Button hsl={[10, 54, 51]}>{isRequested ? 'Decline' : 'Remove Friend'}</Button>
        )}
      </div>
    </motion.section>
  );
}
