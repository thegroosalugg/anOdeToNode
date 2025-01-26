import useDebounce from '@/hooks/useDebounce';
import useFetch from '@/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import Friend from '@/models/Friend';
import Button from '../button/Button';

export default function FriendAlerts({
  friends,
     user,
  setUser,
}: {
  friends: Friend[];
     user: User;
  setUser: Auth['setUser'];
}) {
  const { reqHandler } = useFetch();
  const { deferFn } = useDebounce();
  const connections = friends.filter(
    (friend): friend is Friend & { user: User } =>
      typeof friend.user === 'object' && friend.status !== 'sent'
  ).reverse();

  if (connections.length === 0) {
    return <p>You have no new notifications</p>;
  }

  const friendRequest = async (_id: string, action: 'accept' | 'delete') => {
    deferFn(async () => {
      await reqHandler(
        { url: `social/${_id}/${action}`, method: 'POST' },
        {
          onError: (err) => {
            if (err.status === 401) setUser(null);
          },
        }
      );
    }, 1000);
  };

  return connections.map((connection) => {
    const { meta, status, user: peer } = connection;
    const { _id, name, surname, imgURL } = peer;
    return (
      <li key={_id}>
        {status === 'received' ? (
          <div>
            <span>
              {name} {surname} sent you a friend request
            </span>
            <Button hsl={[30, 50, 50]} onClick={async () => friendRequest(_id, 'accept')}>
              Accept
            </Button>
            <Button hsl={[30, 50, 50]} onClick={async () => friendRequest(_id, 'delete')}>
              Decline
            </Button>
          </div>
        ) : meta.init === user._id ? (
          `${name} accepted your friend request`
        ) : (
          `You are now friends with ${name}`
        )}
      </li>
    );
  });
}
