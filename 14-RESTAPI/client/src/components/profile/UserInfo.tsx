import { useState } from 'react';
import { motion, useAnimate } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDebounce from '@/hooks/useDebounce';
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
  const [scope,          animate] = useAnimate();
  const { deferring,    deferFn } = useDebounce();
  const width = isEditing ? 30 : 60;

  const animation = () =>
    animate('p, section', { opacity: [null, 0, 1] }, { duration: 0.8, ease: 'easeInOut' });

  const editAction = (callback: () => void) => {
    deferFn(() => {
      animation();
      setTimeout(() => callback(), 400);
    }, 1000)
  }

  function saveOrEdit() {
    editAction(() => {
      if (isEditing) {
        console.log('saved');
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    });
  }

  function cancel() {
    editAction(() => setIsEditing(false));
  }


  return (
    <div className={css['info-field']} ref={scope}>
      <h2>
        <FontAwesomeIcon icon={icons[id]} />
        {id}
      </h2>
      <motion.p>
        {isEditing ? (
          <input {...{ id, name: id }} placeholder='type here' autoComplete='off' />
        ) : (
          <span>{text}</span>
        )}
      </motion.p>
      <motion.section className={css['buttons']}>
        <Button
              hsl={[0, 0, 100]}
          onClick={saveOrEdit}
            style={{ width }}
         disabled={deferring}
        >
          {isEditing ? <FontAwesomeIcon icon='check' /> : 'Add'}
        </Button>
        {isEditing && (
          <Button hsl={[0, 0, 100]} onClick={cancel} disabled={deferring}>
            <FontAwesomeIcon icon='x' />
          </Button>
        )}
      </motion.section>
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
