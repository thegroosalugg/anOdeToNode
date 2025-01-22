import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import css from './PeerProfile.module.css';

export default function PeerProfile({ peer }: { peer: User }) {
  const { name, surname } = peer;

  return (
    <section className={css['peer-profile']}>
      <div>
        <ProfilePic user={peer} />
        <h2>
          {name} {surname}
        </h2>
      </div>
    </section>
  );
}
