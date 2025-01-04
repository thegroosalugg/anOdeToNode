import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Post from '@/models/Post';
import css from './Feed.module.css';

export default function Feed({ feed }: { feed: Post[] }) {
  const navigate = useNavigate();
  const fallback = '/fallback_user.png';

  return (
    <ul className={css.feed}>
      <AnimatePresence>
        {feed.length > 0 ? (
          feed.map(({ _id, title, content, author }, i) => (
            <motion.li
               layout
                  key={_id}
              onClick={() => navigate(`/post/${_id}`)}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x:   0, transition: { duration: 0.5, delay: i * 0.1 } }}
                 exit={{ opacity: 0, x:  50, transition: { duration: 0.5 } }}
            >
              <h3>
                <img
                  src={author.imgURL || fallback}
                  alt={author.name}
                  onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
                />
                <span>
                  {author.name} {author.surname}
                </span>
              </h3>
              <h2>{title}</h2>
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
