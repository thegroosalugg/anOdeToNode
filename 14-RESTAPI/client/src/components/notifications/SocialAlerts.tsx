import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import useFetch from '@/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import { FetchError } from '@/util/fetchData';
import { Menu } from './Notifications';
import User from '@/models/User';
import Friend from '@/models/Friend';
import { Alert, Strong, Time, X } from './UIElements';
import Button from '../button/Button';
import css from './SocialAlerts.module.css';

export default function SocialAlerts({
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
  const {  deferFn   } = useDebounce();
  const [ x,    setX ] = useState(0)
  const       navigate = useNavigate();
  const    connections = friends
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

  const onError = (err: FetchError) => {
    if (err.status === 401) setUser(null);
  };

  const friendRequest = async (_id: string, action: 'accept' | 'delete') => {
    setX(-20);
    deferFn(async () => {
      await reqHandler({ url: `social/${_id}/${action}`, method: 'POST' }, { onError });
    }, 1000);
  };

  const clearAlert = async (_id: string) => {
    setX(-20);
    deferFn(async () => {
      await reqHandler(
        { url: `alerts/social/hide/${_id}` },
        { onError, onSuccess: (updated) => setUser(updated) }
      );
    }, 1000);
  };

  const    opacity = 0;
  const transition = { duration: 0.5 };

  return (
    <motion.ul className={css['social-alerts']} exit={{ opacity: 0, transition }}>
      <AnimatePresence mode='popLayout'>
        {connections.length > 0 ? (
          connections.map((connection) => {
            const { _id: alertId, accepted, initiated, user: peer, createdAt } = connection;
            const { _id, name, surname } = peer;
            return (
              <motion.li
                   layout
                      key={alertId + accepted + initiated}
                  initial={{ opacity }}
                  animate={{ opacity: 1, transition: { ...transition, delay: 0.3 } }}
                     exit={{ opacity, x, transition }}
                  onAnimationComplete={() => setX(0)}
              >
                <Time time={createdAt} />
                {!accepted && !initiated ? (
                  <div>
                    <Alert user={peer}>
                      <Strong callback={() => navTo(_id)}>
                        {name} {surname}
                      </Strong>
                      {' sent you a friend request'}
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
                      <Strong callback={() => navTo(_id)}>
                        {name} {surname}
                      </Strong>
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
                      <Strong callback={() => navTo(_id)}>
                        {name}
                      </Strong>
                      {' accepted your friend request'}
                    </Alert>
                    <X callback={() => clearAlert(alertId)} />
                  </>
                ) : (
                  <>
                    <Alert user={peer}>
                      {'You accepted '}
                      <Strong callback={() => navTo(_id)}>
                        {name + "'s"}
                      </Strong>
                      {' friend request'}
                    </Alert>
                    <X callback={() => clearAlert(alertId)} />
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
                 exit={{ opacity, transition }}
          >
            {menuType === 'sent' ? 'No sent requests' : 'You have no new notifications'}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.ul>
  );
}
