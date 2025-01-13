import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Paginated } from '../pagination/Pagination';
import Post from '@/models/Post';
import ProfilePic from '../profile/ProfilePic';
import { timeAgo } from '@/util/timeStamps';
import css from './PostFeed.module.css';

interface PostFeed extends Paginated<Post, 'posts'> {
  alternate?: boolean;
}

export default function PostFeed({ posts, pages, limit, alternate }: PostFeed) {
  const  navigate = useNavigate();
  const direction = pages[0] < pages[1] ? 1 : -1;
  const         x = direction * 50;
  const    height = (alternate ? 60 : 140) * limit + 'px';

  return (
    <ul className={css['feed']} style={{ height }}>
      <AnimatePresence mode='popLayout'>
        {posts.length > 0 ? (
          posts.map(({ _id, title, content, updatedAt, author }, i) => (
            <motion.li
               layout
                  key={_id}
              onClick={() => navigate(`/post/${_id}`)}
              initial={{ opacity: 0, x }}
              animate={{ opacity: 1, x:  0, transition: { duration: 0.5, delay: i * 0.1 } }}
                 exit={{ opacity: 0, x: -x, transition: { duration: 0.5 } }}
            >
              {!alternate && (
                <h3>
                  <ProfilePic user={author} />
                  <span>
                    {author?.name    || 'account '}
                    {author?.surname || 'deleted'}
                  </span>
                </h3>
              )}
              <h2>
                <span>{title}</span>
                <time>{timeAgo(updatedAt)}</time>
              </h2>
              <p>{content}</p>
            </motion.li>
          ))
        ) : (
          <p className={css['fallback']}>Nothing to see here.</p>
        )}
      </AnimatePresence>
    </ul>
  );
}
