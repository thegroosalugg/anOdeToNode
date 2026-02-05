import { HTMLMotionProps, motion } from 'motion/react';
import { API_URL } from '@/lib/http/fetchData';
import User from '@/models/User';
import css from './ProfilePic.module.css';

const fallback = '/fallback-user.png';

export default function ProfilePic({
     user,
  ...props
}: { user: User } & HTMLMotionProps<'img'>) {
  const { name, imgURL } = user || {};
  const src = imgURL ? API_URL + imgURL : fallback;

  return (
    <motion.img
      className={css['profile-pic']}
            src={src}
            alt={name}
        onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
      {...props}
    />
  );
}
