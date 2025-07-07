import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useFetch } from '@/lib/hooks/useFetch';
import { FetchError } from '@/lib/types/common';
import { Auth } from '@/lib/types/auth';
import User from '@/models/User';
import Friend from '@/models/Friend';
import { Alert, Strong, Time, X } from '../ui/UIElements';
import Button from '../../../ui/button/Button';
import css from './SocialAlerts.module.css';

export default function SocialAlerts({
    friends,
    setUser,
  activeTab,
      navTo,
    onError,
}: {
    friends: Friend[];
    setUser: Auth['setUser'];
  activeTab: number;
      navTo: (path: string) => void;
    onError: (err: FetchError) => void;
}) {
  const { reqData } = useFetch<User>();
  const {  deferFn   } = useDebounce();
  const [x,      setX] = useState(0)
  const    connections = friends
    .filter(({ initiated, meta }) => {
      const condition = activeTab === 1 ? initiated : !initiated;
      return condition && meta.show;
    })
    .reverse();

  const friendRequest = async (_id: string, action: 'accept' | 'delete') => {
    setX(-20);
    deferFn(async () => {
      await reqData({ url: `social/${_id}/${action}`, method: 'POST' }, { onError });
    }, 1000);
  };

  const clearAlert = async (_id: string) => {
    setX(-20);
    deferFn(async () => {
      await reqData(
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
            const { _id: alertId, accepted, initiated, user, createdAt } = connection;
            const peer = typeof user === "object" ? user : {} as User; // user should be populated
            const { _id, name, surname } = peer;
            const path = '/user/' + _id;
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
                      <Strong callback={() => navTo(path)}>
                        {name} {surname}
                      </Strong>
                      {' sent you a friend request'}
                    </Alert>
                    <div className={css['buttons']}>
                      <Button
                        onClick={() => friendRequest(_id, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => friendRequest(_id, 'delete')}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ) : !accepted && initiated ? (
                  <>
                    <Alert user={peer}>
                      <Strong callback={() => navTo(path)}>
                        {name} {surname}
                      </Strong>
                    </Alert>
                    <Button
                      className={css['cancel-btn']}
                        onClick={() => friendRequest(_id, 'delete')}
                    >
                      Cancel
                    </Button>
                  </>
                ) : accepted && initiated ? (
                  <>
                    <Alert user={peer}>
                      <Strong callback={() => navTo(path)}>
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
                      <Strong callback={() => navTo(path)}>
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
                  key={activeTab}
            className={css['fallback']}
              initial={{ opacity }}
              animate={{ opacity: 1, transition }}
                 exit={{ opacity, transition }}
          >
            {activeTab === 1 ? 'No sent requests' : 'You have no new notifications'}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.ul>
  );
}
