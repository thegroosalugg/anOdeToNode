import Friend from '@/models/Friend';
import User from '@/models/User';

export default function FriendAlerts({ friends, user }: { friends: Friend[]; user: User }) {
  const connections = friends.filter(
    (friend): friend is Friend & { user: User } =>
      typeof friend.user === 'object' && friend.status !== 'sent'
  );

  if (connections.length === 0) {
    return <p>You have no new notifications</p>;
  }

  return connections.map((connection) => {
    const { meta, status, user: peer } = connection;
    const { _id, name, surname, imgURL } = peer;
    return (
      <li key={_id}>
        {status === 'received'
          ? `${name}  ${surname} sent you a friend request`
          : meta.init === user._id
          ? `${name} accepted your friend request`
          : `You are now friends with ${name}`}
      </li>
    );
  });
}
