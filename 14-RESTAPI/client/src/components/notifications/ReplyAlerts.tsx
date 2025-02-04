import { AnimatePresence, motion } from 'motion/react';
import Reply from '@/models/Reply';
import { Alert, Strong, Time, X } from './UIElements';
import css from './ReplyAlerts.module.css';

// attempted to make as much of FriendAlerts reusable here
// but due to the way it uses recreational keys for both <li> & <fallback>
// it is not possible to combine them further

export default function ReplyAlerts({ replies }: { replies: Reply[] }) {
  const    opacity = 0;
  const transition = { duration: 0.5 };

  return (
    <motion.ul className={css['reply-alerts']} exit={{ opacity: 0, transition }}>
      <AnimatePresence mode='popLayout'>
        {replies.length > 0 ? (
          replies.map(({ _id, creator, content, post, createdAt }) => (
            <motion.li
               layout
                  key={_id}
              initial={{ opacity }}
              animate={{ opacity: 1,      transition }}
                 exit={{ opacity, x: -10, transition }}
            >
              <Time time={createdAt} />
              <section>
                <Alert user={creator}>
                  <Strong callback={() => {}}>
                    {creator.name} {creator.surname}
                  </Strong>
                  {' replied to your post '}
                  <Strong callback={() => {}}>{post.title}</Strong>
                </Alert>
                <p>{content}</p>
              </section>
              <X callback={() => {}} />
            </motion.li>
          ))
        ) : (
          <motion.p
                  key='fallback'
            className={css['fallback']}
              initial={{ opacity }}
              animate={{ opacity: 1, transition }}
                 exit={{ opacity,    transition }}
          >
            No new replies
          </motion.p>
        )}
      </AnimatePresence>
    </motion.ul>
  );
}
