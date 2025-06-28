import { AnimatePresence, motion } from 'motion/react';
import useDebounce from '@/lib/hooks/useDebounce';
import useFetch from '@/lib/hooks/useFetch';
import { FetchError } from '@/lib/util/fetchData';
import { SetData } from '@/lib/types/common';
import Reply from '@/models/Reply';
import { Alert, Strong, Time, X } from './UIElements';
import css from './ReplyAlerts.module.css';

// attempted to make as much of FriendAlerts reusable here
// but due to the way it uses recreational keys for both <li> & <fallback>
// it is not possible to combine them further

export default function ReplyAlerts({
     replies,
  setReplies,
       navTo,
     onError,
}: {
     replies: Reply[];
  setReplies: SetData<Reply[]>;
       navTo: (path: string) => void;
     onError: (err: FetchError) => void;
}) {
  const { reqHandler } = useFetch<Reply | null>();
  const {  deferFn   } = useDebounce();
  const    opacity = 0;
  const transition = { duration: 0.5 };

  const clearAlert = async (_id: string) => {
    deferFn(async () => {
      await reqHandler(
        { url: `alerts/reply/hide/${_id}` },
        {
          onError,
          onSuccess: (updated) =>
            setReplies((prev) => prev.filter(({ _id }) => updated?._id !== _id)),
        }
      );
    }, 1000);
  };

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
                  <Strong callback={() => navTo('/user/' + creator._id)}>
                    {creator.name} {creator.surname}
                  </Strong>
                  {' replied to your post '}
                  <Strong callback={() => navTo('/post/' + post._id)}>{post.title}</Strong>
                </Alert>
                <p>{content}</p>
              </section>
              <X callback={() => clearAlert(_id)} />
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
