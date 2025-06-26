import Post from '@/models/Post';
import ProfilePic from '../ui/image/ProfilePic';
import { timeAgo } from '@/lib/util/timeStamps';

export default function PostItem({
    creator,
      title,
  updatedAt,
    content,
  isCreator,
}: Post & { isCreator?: boolean }) {
  return (
    <>
      {!isCreator && (
        <h3>
          <ProfilePic user={creator} />
          <span>
            {creator?.name    || 'account'}
            {' '}
            {creator?.surname || 'deleted'}
          </span>
        </h3>
      )}
      <h2>
        <span>{title}</span>
        <time>{timeAgo(updatedAt)}</time>
      </h2>
      <p>{content}</p>
    </>
  );
}
