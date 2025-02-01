import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import useFetch from '@/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import { FetchError } from '@/util/fetchData';
import { ReactNode } from 'react';
import { Menu } from './Notifications';
import User from '@/models/User';
import Friend from '@/models/Friend';
import Button from '../button/Button';
import ProfilePic from '../profile/ProfilePic';
import { timeAgo } from '@/util/timeStamps';
import css from './FriendAlerts.module.css';

function Alert({ user, children }: { user: User; children: ReactNode }) {
  return (
    <p className={css['alert-text']}>
      <ProfilePic {...{ user }} />
      <span>
        {children}
      </span>
    </p>
  );
};

export default function FriendAlerts({
    friends,
    setUser,
   menuType,
  closeMenu,
}: {
    friends: Friend[];
    setUser: Auth['setUser'];
   menuType: Menu;
  closeMenu: () => void;
}) {
  const { reqHandler } = useFetch<User>();
  const {   deferFn  } = useDebounce();
  const       navigate = useNavigate();
  const connections = friends
    .filter((friend): friend is Friend & { user: User } => {
      const { user, initiated, meta } = friend;
      const condition = menuType === 'sent' ? initiated : !initiated;
      return typeof user === 'object' && condition && meta.show;
    })
    .reverse();

  const navTo = (_id: string) => {
    closeMenu();
    navigate('/user/' + _id);
  };

  function NameTag({ _id, children }: { _id: string; children: ReactNode }) {
    return (
      <strong className={css['name-tag']} onClick={() => navTo(_id)}>
        {children}
      </strong>
    );
  };

  const onError = (err: FetchError) => {
    if (err.status === 401) setUser(null);
  };

  const friendRequest = async (_id: string, action: 'accept' | 'delete') => {
    deferFn(async () => {
      await reqHandler({ url: `social/${_id}/${action}`, method: 'POST' }, { onError });
    }, 1000);
  };

  const clearAlert = async (_id: string) => {
    deferFn(async () => {
      await reqHandler(
        { url: `alert/social/hide/${_id}`, method: 'POST' },
        { onError, onSuccess: (updated) => setUser(updated) }
      );
    }, 1000);
  };

  function X({ _id }: { _id: string }) {
    return (
      <button className={css['x-btn']} onClick={() => clearAlert(_id)}>
        <FontAwesomeIcon icon='x' size='xl' />
      </button>
    );
  }

  const    opacity = 0;
  const transition = { duration: 0.5 };
  const        dir = menuType === 'sent' ? 1 : -1;
  const          x = 20 * dir;

  return (
    <AnimatePresence mode='popLayout'>
      {connections.length > 0 ? (
        connections.map((connection) => {
          const { _id: alertId, accepted, initiated, user: peer, createdAt } = connection;
          const { _id, name, surname } = peer;
          return (
            <motion.li
                 layout
              className={css['friend-alert']}
                    key={alertId + accepted + initiated}
                initial={{ opacity,    x }}
                animate={{ opacity: 1, x:  0, transition: { ...transition, delay: 0.3 } }}
                   exit={{ opacity,    x,     transition }}
            >
              <time className={css['time-stamp']}>{timeAgo(createdAt)}</time>
              {!accepted && !initiated ? (
                <div>
                  <Alert user={peer}>
                    <NameTag {...{ _id }}>
                      {name} {surname}
                    </NameTag>{' '}
                    sent you a friend request
                  </Alert>
                  <div className={css['buttons']}>
                    <Button
                      hsl={[102, 44, 40]}
                      onClick={() => friendRequest(_id, 'accept')}
                    >
                      Accept
                    </Button>
                    <Button
                      hsl={[10, 54, 51]}
                      onClick={() => friendRequest(_id, 'delete')}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ) : !accepted && initiated ? (
                <>
                  <Alert user={peer}>
                    <NameTag {...{ _id }}>
                      {name} {surname}
                    </NameTag>
                  </Alert>
                  <Button
                        hsl={[10, 54, 51]}
                  className={css['cancel-btn']}
                    onClick={() => friendRequest(_id, 'delete')}
                  >
                    Cancel
                  </Button>
                </>
              ) : accepted && initiated ? (
                <>
                  <Alert user={peer}>
                    <NameTag {...{ _id, children: name }} /> accepted your friend request
                  </Alert>
                  <X _id={alertId} />
                </>
              ) : (
                <>
                  <Alert user={peer}>
                    You accepted <NameTag {...{ _id, children: name + "'s" }} /> friend
                    request
                  </Alert>
                  <X _id={alertId} />
                </>
              )}
            </motion.li>
          );
        })
      ) : (
        <motion.p
                key={menuType}
          className={css['fallback']}
            initial={{ opacity }}
            animate={{ opacity: 1, transition }}
               exit={{ opacity,    transition }}
        >
          {menuType === 'sent' ? 'No sent requests' : 'You have no new notifications'}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
