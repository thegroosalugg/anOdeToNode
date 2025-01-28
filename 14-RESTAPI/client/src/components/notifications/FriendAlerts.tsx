import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import useFetch from '@/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import { FetchError } from '@/util/fetchData';
import { ReactNode } from 'react';
import User from '@/models/User';
import Friend from '@/models/Friend';
import Button from '../button/Button';
import ProfilePic from '../profile/ProfilePic';
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
       user,
    setUser,
  closeMenu,
}: {
    friends: Friend[];
       user: User;
    setUser: Auth['setUser'];
  closeMenu: () => void;
}) {
  const { reqHandler } = useFetch<User>();
  const {   deferFn  } = useDebounce();
  const       navigate = useNavigate();
  const connections = friends
    .filter((friend): friend is Friend & { user: User } => {
      const { user, status, meta } = friend;
      return typeof user === 'object' && status !== 'sent' && meta.show;
    })
    .reverse();

  if (connections.length === 0) {
    return <p className={css['fallback']}>You have no new notifications</p>;
  }

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
        { url: `alert/${_id}`, method: 'POST' },
        { onError, onSuccess: (updated) => setUser(updated) }
      );
    }, 1000);
  };

  function X({ _id }: { _id: string }) {
    return (
      <button className={css['x-button']} onClick={() => clearAlert(_id)}>
        <FontAwesomeIcon icon='x' size='2xl' />
      </button>
    );
  }

  return connections.map((connection) => {
    const { _id: alertId, meta, status, user: peer } = connection;
    const { _id, name, surname } = peer;
    return (
      <li className={css['friend-alert']} key={alertId}>
        {status === 'received' ? (
          <div>
            <Alert user={peer}>
              <NameTag {...{ _id }}>
                {name} {surname}
              </NameTag>{' '}
              sent you a friend request
            </Alert>
            <div className={css['buttons']}>
              <Button hsl={[102, 44, 40]} onClick={async () => friendRequest(_id, 'accept')}>
                Accept
              </Button>
              <Button hsl={[ 10, 54, 51]} onClick={async () => friendRequest(_id, 'delete')}>
                Decline
              </Button>
            </div>
          </div>
        ) : meta.init === user._id ? (
          <>
            <Alert user={peer}>
              <NameTag {...{ _id, children: name }} /> accepted your friend request
            </Alert>
            <X _id={alertId} />
          </>
        ) : (
          <>
            <Alert user={peer}>
              You accepted <NameTag {...{ _id, children: name + "'s" }} /> friend request
            </Alert>
            <X _id={alertId} />
          </>
        )}
      </li>
    );
  });
}
