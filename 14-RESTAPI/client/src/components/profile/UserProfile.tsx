import User from '@/models/User';
import css from './UserProfile.module.css';

export default function UserProfile({ user, logout }: { user: User; logout: () => void }) {
  const { name, surname, email, imgURL } = user;

  console.log('imgURL', imgURL);

  return (
    <section className={css['user-profile']}>
      {name}
      {surname}
      {email}
      <button onClick={logout}>Logout</button>
    </section>
  );
}
