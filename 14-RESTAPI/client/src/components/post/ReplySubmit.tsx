import { FC, FormEvent } from 'react';
import { motion, useAnimate, AnimatePresence } from 'motion/react';
import useFetch from '@/hooks/useFetch';
import useDebounce from '@/hooks/useDebounce';
import Reply from '@/models/Reply';
import Loader from '../loading/Loader';
import css from './ReplySubmit.module.css';

const ReplySubmit: FC<{ postId: string }> = ({ postId }) => {
  const { data, reqHandler, isLoading, error, setError } = useFetch<Reply | null>();
  const [ scope,     animate ] = useAnimate();
  const { deferring, deferFn } = useDebounce();

  const onSuccess = () => {
    setError(null);
    animate(scope.current, { scale: [1, 1.05, 1] }, { duration: 0.4, delay: 0.3 });
    animate(
      'textarea',
      { opacity: [null, 0, 0, 1], y: [null, -10, 0, 0] },
      { duration: 2, times: [0, 0.2, 0.9, 1] }
    );
    animate(
      'button',
      { background: [null, '#52a456', '#52a456', '#949494'] },
      { duration: 2, times: [0, 0.1, 0.85, 1] }
    );
    setTimeout(() => scope.current.reset(), 800);
  };

  const onError = () => {
    animate(
      'button',
      { background: 'var(--error-red)', x: [null, 5, 0, 5, 0] },
      { background: { duration: 1 },    x: { repeat: 1, duration: 0.3 } }
    );
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    await reqHandler(
      { url: `post/reply/${postId}`, method: 'POST', data },
      { onSuccess, onError }
    );
  };

  return (
    <motion.form
      className={css['reply-submit']}
            ref={scope}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.8 } }}
       onSubmit={(e) => {
         e.preventDefault();
         deferFn(() => submitHandler(e), 1500);
      }}
    >
      <textarea name='content' rows={4} />
      <motion.button disabled={deferring}>
        <AnimatePresence mode='wait'>
          {isLoading ? (
            <Loader small key='loader' />
          ) : (
            <motion.span
                  key={data + ''}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
                 exit={{ opacity: 0 }}
            >
              {error ? error.content : 'Reply'}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
};

export default ReplySubmit;
