import { AnimatePresence, motion } from 'motion/react';
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
  const exit = { height: '0', transition: { duration: 0.8 } };
  const variants = {
     hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <motion.section
       className={css['postId']}
         initial='hidden'
         animate='visible'
      transition={{ staggerChildren: 0.3 }}
    >
      <motion.h1 variants={variants}>
        <motion.span key={title} initial={false} animate={{ opacity: [0, 1] }}>
          {title}
        </motion.span>
        <span>
          {author?.name    || 'Account '}
          {author?.surname || 'deleted'}
        </span>
        <ProfilePic user={author} />
      </motion.h1>
      <motion.time variants={variants}>
        {timeAgo(updatedAt)}
      </motion.time>
      <AnimatePresence>
        {imgURL && (
          <motion.img
                 key={imgURL}
                 src={BASE_URL + imgURL}
                 alt={title}
             loading='eager'
                exit={exit}
            variants={variants}
             onError={(e) => {
               const img = e.target as HTMLImageElement;
               img.src = '/notFound.png';
               img.style.background = '#81818154';
            }}
          />
        )}
        <motion.p key={content} variants={variants} exit={exit}>
          {content}
        </motion.p>
      </AnimatePresence>
      {user && (
        <motion.section className={css['buttons']} variants={variants}>
          <Button hsl={[180, 80, 35]}> Reply</Button>
          {user._id === author?._id && (
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
