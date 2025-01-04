import { BASE_URL } from '@/util/fetchData';
import Post from '@/models/Post';
import css from './PostId.module.css';
import ProfilePic from '../profile/ProfilePic';

export default function PostId({ post }: { post: Post }) {
  const { title, content, imgURL, author } = post;

  return (
    <section className={css['postId']}>
      <h1>
        <span>{title}</span>
        <span>{author.name} {author.surname}</span>
        <ProfilePic user={author} />
      </h1>
      <p>{content}</p>
      {imgURL && <img src={BASE_URL + imgURL} alt={title} />}
    </section>
  );
}
