import useFetch from '@/hooks/useFetch';
import Button from '../button/Button';
import css from './Form.module.css';
import Input from './Input';
import Post from '@/models/Post';

export default function Form({ callback }: { callback: () => void }) {
  const { error, reqHandler } = useFetch<Post | null>(null);

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const post = await reqHandler({ url: 'feed/new-post', method: 'POST', data });
    if (post) callback();
  }

  return (
    <form className={css.form} onSubmit={submitHandler}>
      <Input id='title'   errors={error} />
      <Input id='content' errors={error} text rows={5} />
      <Button hsl={[37, 96, 45]}>Post</Button>
    </form>
  );
}
