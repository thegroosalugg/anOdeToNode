import User from '@/models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import css from './UserInfo.module.css';

const icons = {
    bio: 'comment-dots',
   home: 'house',
   work: 'briefcase',
  study: 'book',
} as const;

function InfoField({ id, text }: { id: keyof typeof icons; text: string }) {
  return (
    <p className={css['info-field']}>
      <span>
        <FontAwesomeIcon icon={icons[id]} />
        {id}
      </span>
      <span>{text}</span>
    </p>
  );
}

export default function UserInfo({ user }: { user: User }) {
  return (
    <section className={css['user-info']}>
      <InfoField {...{ id: 'bio',   text: 'text' }} />
      <InfoField {...{ id: 'home',  text: 'text' }} />
      <InfoField {...{ id: 'work',  text: 'text' }} />
      <InfoField {...{ id: 'study', text: 'text' }} />
    </section>
  );
}
