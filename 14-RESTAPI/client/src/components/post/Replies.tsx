import Reply from '@/models/Reply';
import css from './Replies.module.css';
import { timeAgo } from '@/util/timeStamps';
import ProfilePic from '../profile/ProfilePic';

export default function Replies({ replies }: { replies: Reply[] }) {
  return (
    <ul className={css['replies']}>
      {replies.map(({ _id, content, updatedAt, creator }) => (
        <li key={_id}>
          <h2>
            <ProfilePic user={creator} />
            <span>
              {creator?.name    || 'Account '}
              {creator?.surname || 'deleted'}
            </span>
            <time>{timeAgo(updatedAt)}</time>
          </h2>
          <p>{content}</p>
        </li>
      ))}
    </ul>
  );
}
