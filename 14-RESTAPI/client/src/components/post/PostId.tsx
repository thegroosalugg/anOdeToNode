import { motion } from 'motion/react';
import { BASE_URL } from '@/util/fetchData';
import Post from '@/models/Post';
import css from './PostId.module.css';
import ProfilePic from '../profile/ProfilePic';

export default function PostId({ post }: { post: Post }) {
  const { title, content, imgURL, author } = post;
  const variants = {
     hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <motion.section
       className={css['postId']}
         initial='hidden'
         animate='visible'
      transition={{ staggerChildren: 0.5 }}
    >
      <motion.h1 variants={variants}>
        <span>{title}</span>
        <span>
          {author.name} {author.surname}
        </span>
        <ProfilePic user={author} />
      </motion.h1>
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
    </motion.section>
  );
}
