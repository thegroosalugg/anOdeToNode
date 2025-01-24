import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';
import { useEffect } from 'react';
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
  const { _id, name, surname } = peer;

  const connection = user?.friends.find((friend) => friend.user === _id);
  const { text, icon, hsl, color } = PEER_CONFIG[connection?.status || 'none'];
  const borderColor = connection ? 'transparent' : 'var(--team-green)';

  async function clickHandler() {
    if (!connection) {
      await reqHandler({ url: `social/add/${_id}`, method: 'POST' });
    }
  }

  useEffect(() => {
    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog(-100, 150, ['PEER PROFILE: Socket connected']));

    socket.on(`peer:${_id}:update`, (updated) => {
      setUser(updated);
    })

  }, [_id, setUser]);

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
      </div>
    </motion.section>
  );
}
