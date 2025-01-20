import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';

export default function UserItem({ user }: { user: User }) {
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
