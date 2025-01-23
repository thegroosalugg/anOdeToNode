import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/util/fetchData';
import { timeAgo } from '@/util/timeStamps';
import { Auth } from '@/pages/RootLayout';
import Post from '@/models/Post';
import ProfilePic from '../profile/ProfilePic';
import Button from '../button/Button';
import css from './PostId.module.css';

export default function PostId({
      post,
      user,
  setModal,
}: {
      post: Post;
      user: Auth['user'];
  setModal: (modal: string) => void;
}) {
  const { title, content, imgURL, creator, updatedAt } = post;
  const transition = { duration: 0.8 };
  const    opacity = 0;
  const     hidden = { opacity };
  const    visible = { opacity: 1, transition };
  const   variants = { hidden, visible };
  const   navigate = useNavigate();

  const htnlRef = useRef<HTMLParagraphElement | null>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    if (htnlRef.current) {
      setHeight(htnlRef.current.offsetHeight + 16); // 16 for padding
    }
  }, [content]);

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
        <span onClick={() => navigate('/user/' + creator._id)}>
          {creator?.name    || 'Account'}
          {' '}
          {creator?.surname || 'deleted'}
          <ProfilePic user={creator} />
        </span>
      </motion.h1>
      <motion.time variants={variants}>
        {timeAgo(updatedAt)}
      </motion.time>
      <AnimatePresence mode='wait'>
        {imgURL && (
          <motion.img
                 key={imgURL}
                 src={BASE_URL + imgURL}
                 alt={title}
             loading='eager'
                exit={{ opacity, transition }}
            variants={{
               hidden: {  opacity,   height: 200 },
              visible: { ...visible, height: 200 }
            }}
             onError={(e) => {
               const img = e.target as HTMLImageElement;
               img.src = '/notFound.png';
               img.style.background = '#81818154';
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode='wait'>
        <motion.p
               key={content}
               ref={htnlRef}
          variants={variants}
             style={{ height, maxHeight: 200 }}
           animate={{
                 height: 'auto',
                opacity: 1,
             transition: { ease: 'easeInOut', duration: 1 }
           }}
        >
          {content}
        </motion.p>
      </AnimatePresence>
      {user?._id === creator?._id && (
        <motion.section className={css['buttons']} variants={variants}>
          <Button hsl={[180, 80, 35]} onClick={() => setModal('edit')}>
            Edit
          </Button>
          <Button hsl={[10, 54, 51]} onClick={() => setModal('delete')}>
            Delete
          </Button>
        </motion.section>
      )}
    </motion.section>
  );
}
