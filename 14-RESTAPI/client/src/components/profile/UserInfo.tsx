import { useState } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import User from '@/models/User';
import Button from '../button/Button';
import css from './UserInfo.module.css';

const icons = {
    bio: 'comment-dots',
   home: 'house',
   work: 'briefcase',
  study: 'book',
} as const;

function InfoField({ id, text }: { id: keyof typeof icons; text: string }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={css['info-field']}>
      <h2>
        <FontAwesomeIcon icon={icons[id]} />
        {id}
      </h2>
      <motion.p
            key={isEditing + ''}
        animate={{ opacity: [0, 1], transition: { duration: 1, ease: 'easeInOut' } }}
      >
        {isEditing ? (
          <input {...{ id, name: id }} placeholder='type here' autoComplete='off' />
        ) : (
          <span>{text}</span>
        )}
      </motion.p>
      <Button hsl={[0, 0, 100]} onClick={() => setIsEditing(!isEditing)}>
        Add
      </Button>
    </div>
  );
}

export default function UserInfo({ user }: { user: User }) {
  return (
    <section className={css['user-info']}>
      <InfoField {...{ id: 'home',  text: 'text' }} />
      <InfoField {...{ id: 'work',  text: 'text' }} />
      <InfoField {...{ id: 'study', text: 'text' }} />
      <InfoField {...{ id: 'bio',   text: 'text' }} />
    </section>
  );
}
