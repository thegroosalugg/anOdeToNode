import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Pages } from '../pagination/Pagination';
import Post from '@/models/Post';
import css from './Feed.module.css';
import ProfilePic from '../profile/ProfilePic';
import { timeAgo } from '@/util/timeStamps';

export default function Feed({ data, pages }: { data: Pages<Post, 'posts'>, pages: number[] }) {
  const navigate = useNavigate();
  const { posts, docCount } = data;
  const direction = pages[0] < pages[1] ? 1 : -1;
  const x = 50 * direction;

  return (
    <ul className={css['feed']} style={{ height: docCount > 3 ? '560px' : '' }}>
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
              <h3>
                <ProfilePic user={author} />
                <span>
                  {author?.name    || 'account '}
                  {author?.surname || 'deleted'}
                </span>
              </h3>
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
