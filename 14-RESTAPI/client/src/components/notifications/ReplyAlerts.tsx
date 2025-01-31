import Reply from '@/models/Reply';
import css from './ReplyAlerts.module.css';

export default function ReplyAlerts({ replies }: { replies: Reply[] }) {
  return replies.map(({ _id, creator, content, updatedAt, meta }) => (
    <li key={_id} className={css['reply-alert']}>
      <p>{creator.name} {creator.surname}</p>
      <p>{content}</p>
    </li>
  ));
}
