import Reply from '@/models/Reply';
import { Alert, Strong, Time, X } from './UIElements';
import css from './ReplyAlerts.module.css';

export default function ReplyAlerts({ replies }: { replies: Reply[] }) {
  return replies.map(({ _id, creator, content, post, createdAt }) => (
    <li key={_id} className={css['reply-alert']}>
      <Time time={createdAt} />
      <section>
        <Alert user={creator}>
          <Strong callback={() => {}}>
            {creator.name} {creator.surname}
          </Strong>
          {' replied to your post '}
          <Strong callback={() => {}}>{post.title}</Strong>
        </Alert>
        <p>{content}</p>
      </section>
      <X callback={() => {}} />
    </li>
  ));
}
