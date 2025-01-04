import { motion } from 'motion/react';
import { BASE_URL } from '@/util/fetchData';
import { timeAgo } from '@/util/timeStamps';
import Post from '@/models/Post';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import Button from '../button/Button';
import css from './PostId.module.css';

export default function PostId({
  post,
  user,
  setModal,
}: {
      post: Post;
      user: User | null;
  setModal: (modal: string) => void;
}) {
  const { title, content, imgURL, author, updatedAt } = post;
  const variants = {
     hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.section
       className={css['postId']}
         initial='hidden'
         animate='visible'
      transition={{ staggerChildren: 0.3 }}
    >
      <motion.h1 variants={variants}>
        <span>{title}</span>
        <span>
          {author.name} {author.surname}
        </span>
        <ProfilePic user={author} />
      </motion.h1>
      <motion.time variants={variants}>
        {timeAgo(updatedAt)}
      </motion.time>
      {imgURL && (
        <motion.img
               src={BASE_URL + imgURL}
               alt={title}
          variants={variants}
           onError={(e) => {
             const img = e.target as HTMLImageElement;
             img.src = '/notFound.png';
             img.style.background = '#81818154';
          }}
        />
      )}
      <motion.p variants={variants}>{content}</motion.p>
      {user && (
        <motion.section className={css['buttons']} variants={variants}>
          <Button hsl={[180, 80, 35]}> Reply</Button>
          {user._id === author._id && (
            <>
              <Button hsl={[28, 64, 50]} onClick={() => setModal('edit')}>
                Edit
              </Button>
              <Button hsl={[10, 54, 51]} onClick={() => setModal('delete')}>
                Delete
              </Button>
            </>
          )}
        </motion.section>
      )}
    </motion.section>
  );
}
