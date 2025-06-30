import { useAnimate, stagger, AnimatePresence, motion } from 'motion/react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useFetch } from '@/lib/hooks/useFetch';
import { Auth } from '@/lib/types/auth';
import { FetchError } from '@/lib/types/common';
import Post from '@/models/Post';
import Input from './Input';
import ImagePicker from './ImagePicker';
import Button from '../ui/button/Button';
import Error from '../ui/boundary/error/Error';
import Loader from '../ui/boundary/loader/Loader';
import css from './PostForm.module.css';

export default function PostForm({
  onSuccess,
    setUser,
       post,
}: {
  onSuccess?: () => void;
     setUser: Auth['setUser'];
       post?: Post | null;
}) {
  const { isLoading, error, reqData } = useFetch<Post | null>();
  const [ scope,               animate ] = useAnimate();
  const { deferring,           deferFn } = useDebounce();
  const { _id = '', title = '', content = '', imgURL = '' } = post || {};
  const url = `post/${_id ? `edit/${_id}` : 'new'}`;
  const method: 'PUT' | 'POST' = _id ? 'PUT' : 'POST';
  const filter = `brightness(${deferring ? 0.8 : 1})`;

  const onError = (err: FetchError) => {
    if (error && !error.message) {
      animate(
        'p',
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
    if (err.status === 401) setUser(null);
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    deferFn(async () => {
      const data = new FormData(e.currentTarget); // multipart/form-data
      await reqData({ url, method, data }, { onError, onSuccess });
    }, 1200)
  }

  return (
    <AnimatePresence mode='wait'>
      {error?.message ? (
        <Error key='error' error={error} />
      ) : (
        <motion.form
               key='form'
          className={css['post-form']}
           onSubmit={submitHandler}
                ref={scope}
               exit={{ opacity: 0, scale: 0.8 }}
        >
          <section className={css['inputs']}>
            <section>
              <Input id='title'   errors={error} defaultValue={title} />
              <Input id='content' errors={error} defaultValue={content} text rows={5} />
            </section>
            <ImagePicker imgURL={imgURL} style={{ marginTop: '2px' }} /> {/* applies to this layout only */}
          </section>
          <Button
             disabled={deferring}
             whileTap={{ scale: deferring ? 1 : 0.9 }} // overwrites default
           animations={{ filter }} // additional animate props without overwriting default
          >
            {isLoading ? <Loader size="xs" color="bg" /> : 'Post'}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
