import { motion, AnimatePresence } from 'framer-motion';
import Post from '@/models/Post';
import css from './Feed.module.css';

export default function Feed({ feed }: { feed: Post[] }) {
  const fallback = '/fallback_user.png';
  
  return (
    <ul className={css.feed}>
      <AnimatePresence>
        {feed.map(({ _id, title, content, user }, i) => (
          <motion.li
             layout
                key={_id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x:   0, transition: { duration: 0.5, delay: i * 0.1 } }}
               exit={{ opacity: 0, x:  50, transition: { duration: 0.5 } }}
          >
            <h3>
              <img
                    src={user.imgURL || fallback}
                    alt={user.name}
                onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
              />
              <span>
                {user.name} {user.surname}
              </span>
            </h3>
            <h2>{title}</h2>
            <p>{content}</p>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
