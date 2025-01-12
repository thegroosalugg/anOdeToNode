import { useAnimate, stagger, AnimatePresence, motion } from 'motion/react';
import useFetch from '@/hooks/useFetch';
import Post from '@/models/Post';
import Input from './Input';
import ImagePicker from './ImagePicker';
import Button from '../button/Button';
import Error from '../error/Error';
import Loader from '../loading/Loader';
import css from './PostForm.module.css';

export default function PostForm({
       url = 'post/new',
    method = 'POST',
  callback,
      post,
}: {
      url?: 'post/new' | `post/edit/${string}`;
   method?: 'POST' | 'PUT';
  callback: (post: Post) => void;
     post?: Post | null;
}) {
  const { isLoading, error, reqHandler } = useFetch<Post | null>();
  const [ scope, animate ] = useAnimate();
  const { title = '', content = '', imgURL = '' } = post || {};

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget); // multipart/form-data
    const post = await reqHandler({ url, method, data });
    if (post) {
      callback(post);
    } else if (error && !error.message) {
      animate(
        'p',
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
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
          <Button hsl={[28, 64, 50]}>
            {isLoading ? <Loader small /> : 'Post'}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
