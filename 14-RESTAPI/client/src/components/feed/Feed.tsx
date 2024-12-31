import Post from '@/models/Post';
import css from './Feed.module.css';

export default function Feed({ feed }: { feed: Post[] }) {
  return (
    <ul className={css.feed}>
      {feed.map(({ _id, title, content }) => (
        <li key={_id}>
          <h2>{title}</h2>
          <p>{content}</p>
        </li>
      ))}
    </ul>
  );
}
