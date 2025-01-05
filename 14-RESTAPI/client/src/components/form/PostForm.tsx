import { useAnimate, stagger } from 'motion/react';
import useFetch from '@/hooks/useFetch';
import Post from '@/models/Post';
import Input from './Input';
import ImagePicker from './ImagePicker';
import Button from '../button/Button';
import css from './PostForm.module.css';

export default function PostForm({
       url = 'feed/new-post',
    method = 'POST',
  callback,
      post,
}: {
      url?: 'feed/new-post' | `feed/post/${string}`;
   method?: 'POST' | 'PUT';
  callback: (post: Post) => void;
     post?: Post | null
}) {
  const { error, reqHandler } = useFetch<Post | null>(null);
  const [ scope,    animate ] = useAnimate();
  const { title = '', content = '' } = post || {};

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const post = await reqHandler({ url, method, data });
    if (post) {
      callback(method === 'PUT' && post);
    } else {
      animate(
        'p',
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
  }

  return (
    <form className={css['post-form']} onSubmit={submitHandler} ref={scope}>
      <section className={css['inputs']}>
        <section>
          <Input id='title'   errors={error} defaultValue={title} />
          <Input id='content' errors={error} defaultValue={content} text rows={5} />
        </section>
        <ImagePicker style={{ marginTop: '2px' }} /> {/* applies to this layout only */}
      </section>
      <Button hsl={[28, 64, 50]}>Post</Button>
    </form>
  );
}
