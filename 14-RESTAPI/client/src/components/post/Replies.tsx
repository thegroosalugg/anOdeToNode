import Reply from '@/models/Reply';
import css from './Replies.module.css';

export default function Replies({ replies }: { replies: Reply[] }) {
  return (
    <ul className={css['replies']}>
      {replies.map(({ _id, content, updatedAt, creator }) => (
        <li key={_id}>{content}</li>
      ))}
    </ul>
  );
}
