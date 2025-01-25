import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';

export default function PeerItem({ user }: { user: User }) {
  const { name, surname } = user;
  return (
    <>
      <ProfilePic user={user} />
      <h2>
        {name} {surname}
      </h2>
    </>
  );
}
