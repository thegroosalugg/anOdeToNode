import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Post from '@/models/Post';
import css from './Feed.module.css';
import ProfilePic from '../profile/ProfilePic';
import { timeAgo } from '@/util/timeStamps';

export default function Feed({ feed }: { feed: Post[] }) {
  const navigate = useNavigate();

  return (
    <ul className={css.feed}>
      <AnimatePresence>
        {feed.length > 0 ? (
          feed.map(({ _id, title, content, updatedAt, author }, i) => (
            <motion.li
               layout
                  key={_id}
              onClick={() => navigate(`/post/${_id}`)}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x:   0, transition: { duration: 0.5, delay: i * 0.1 } }}
                 exit={{ opacity: 0, x:  50, transition: { duration: 0.5 } }}
            >
              <h3>
                <ProfilePic user={author} />
                <span>
                  {author.name} {author.surname}
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
          <p>Nothing to see here.</p>
        )}
      </AnimatePresence>
    </ul>
  );
}
