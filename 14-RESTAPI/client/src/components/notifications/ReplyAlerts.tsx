import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Reply from '@/models/Reply';
import ProfilePic from '../profile/ProfilePic';
import { timeAgo } from '@/util/timeStamps';
import css from './ReplyAlerts.module.css';
import shared from './FriendAlerts.module.css';

export default function ReplyAlerts({ replies }: { replies: Reply[] }) {
  return replies.map(({ _id, creator, content, post, createdAt }) => (
    <li key={_id} className={css['reply-alert']}>
      <time className={shared['time-stamp']}>{timeAgo(createdAt)}</time>
      <section>
        <h2>
          <ProfilePic user={creator} />
          <span>
            <strong>
              {creator.name} {creator.surname}
            </strong>
            {' replied to your post '}
            <strong>{post.title}</strong>
          </span>
        </h2>
        <p>{content}</p>
      </section>
      <button>
        <FontAwesomeIcon icon='x' size='2xl' />
      </button>
    </li>
  ));
}
