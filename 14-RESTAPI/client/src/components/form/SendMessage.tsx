import { FormEvent } from 'react';
import { motion, useAnimate, AnimatePresence } from 'motion/react';
import { Auth } from '@/lib/types/auth';
import { FetchError } from '@/lib/types/common';
import { useFetch } from '@/lib/hooks/useFetch';
import { useDebounce } from '@/lib/hooks/useDebounce';
import Loader from '../ui/boundary/loader/Loader';
import css from './SendMessage.module.css';

export default function SendMessage({
      url,
  setUser,
   isPost,
}: {
      url: string;
  setUser: Auth['setUser'];
  isPost?: boolean;
}) {
  const { reqData, isLoading, error, setError } = useFetch();
  const [ scope,     animate ] = useAnimate();
  const { deferring, deferFn } = useDebounce();
  const classes = `${css['send-msg']} ${isPost ? css['isPost'] : ''}`;
  const rows = isPost ? 4 : 2;

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
      { background: [null, '#12a1a1', '#12a1a1', isPost ? '#949494' : '#287a91'] },
      { duration: 2, times: [0, 0.1, 0.85, 1] }
    );
    setTimeout(() => scope.current?.reset(), 800);
  };

  const onError = (err: FetchError) => {
    animate(
      'button',
      { background: 'var(--error)', x: [null, 5, 0, 5, 0] },
      { background: { duration: 1 },    x: { repeat: 1, duration: 0.3 } }
    );
    if (err.status === 401) setUser(null);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    await reqData({ url, method: 'POST', data }, { onSuccess, onError });
  };

  return (
    <motion.form
      className={classes}
            ref={scope}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1, duration: 0.5 } }}
           exit={{ opacity: 0 }}
       onSubmit={(e) => {
         e.preventDefault();
         deferFn(() => submitHandler(e), 1500);
      }}
    >
      <textarea name='content' rows={rows} />
      <motion.button disabled={deferring}>
        <AnimatePresence mode='wait'>
          {isLoading ? (
            <Loader key='loader' size="xs" color="bg" />
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
                 exit={{ opacity: 0 }}
            >
              {/* content = 422 form errors, message = all other errors */}
              {error?.content ?? error?.message ?? 'Send'}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
};
