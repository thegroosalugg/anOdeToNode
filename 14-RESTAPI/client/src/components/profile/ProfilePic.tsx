import { BASE_URL } from '@/util/fetchData';
import User from '@/models/User';
import css from './ProfilePic.module.css';

const fallback = '/fallback_user.png';

export default function ProfilePic({ user, ...props }: { user: User }) {
  const { name, imgURL } = user || {};
  const src = imgURL ? BASE_URL + imgURL : fallback;

  return (
    <img
      className={css['profile-pic']}
            src={src}
            alt={name}
        onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
      {...props}
    />
  );
}
