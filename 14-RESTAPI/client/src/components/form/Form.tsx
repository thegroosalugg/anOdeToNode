import { useAnimate, stagger } from 'motion/react';
import useFetch from '@/hooks/useFetch';
import Post from '@/models/Post';
import Input from './Input';
import Button from '../button/Button';
import css from './Form.module.css';
import ImagePicker from './ImagePicker';

export default function Form({ callback }: { callback: () => void }) {
  const { error, reqHandler } = useFetch<Post | null>(null);
  const [ scope,    animate ] = useAnimate();

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const post = await reqHandler({ url: 'feed/new-post', method: 'POST', data });
    if (post) {
      callback();
    } else {
      animate(
        'p',
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
  }

  return (
    <form className={css.form} onSubmit={submitHandler} ref={scope}>
      <Input id='title'   errors={error} />
      <Input id='content' errors={error} text rows={5} />
      <ImagePicker />
      <Button hsl={[37, 96, 45]}>Post</Button>
    </form>
  );
}
