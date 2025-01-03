import Post from '@/models/Post';
import css from './PostId.module.css';
import { BASE_URL } from '@/util/fetchData';

export default function PostId({ post }: { post: Post }) {
  const { title, content, imgURL } = post;

  return (
    <section className={css['postId']}>
      <h1>{title}</h1>
      <p>{content}</p>
      {imgURL && <img src={BASE_URL + imgURL} alt={title} />}
    </section>
  );
}
