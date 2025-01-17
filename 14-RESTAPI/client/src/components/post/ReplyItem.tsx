import Reply from '@/models/Reply';
import ProfilePic from '../profile/ProfilePic';
import { timeAgo } from '@/util/timeStamps';

export default function ReplyItem({ creator, content, updatedAt }: Reply) {
  return (
    <>
      <h2>
        <ProfilePic user={creator} />
        <span>
          {creator?.name    || 'Account '}
          {creator?.surname || 'deleted'}
        </span>
        <time>{timeAgo(updatedAt)}</time>
      </h2>
      <p>{content}</p>
    </>
  );
}
