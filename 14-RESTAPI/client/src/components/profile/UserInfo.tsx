import { useState } from 'react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useFetch from '@/hooks/useFetch';
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

function InfoField({ id, user }: { id: keyof typeof icons; user: User }) {
  const { reqHandler,     error } = useFetch<string>();
  const [isEditing, setIsEditing] = useState(false);
  const [value,         setValue] = useState('');
  const [text,           setText] = useState(user.about?.[id]);
  const [scope,          animate] = useAnimate();
  const { deferring,    deferFn } = useDebounce();
  const   fallback =  `Add ${id}`;
  const      width = isEditing ? 30 : 60;
  const       ease = [0.65, 0, 0.35, 1] as const;
  const   duration = 0.4;
  const transition = { duration, ease };
  const slideInOut = {
      initial: { y: -30 },
      animate: { y:   0 },
         exit: { y:  30 },
    transition
  };

  const animateBtns = () =>
    animate('section', { opacity: [null, 0, 1] }, { ease, duration: 0.8 });

  const editAction = (callback: () => void) => {
    deferFn(() => {
      animateBtns();
      setTimeout(() => callback(), 400);
    }, 1000)
  }

  function saveOrEdit() {
    editAction(async () => {
      if (isEditing) {
        const data = { [id]: value };
        await reqHandler(
          { url: 'profile/info', method: 'POST', data },
          { onSuccess: (res) => setText(res) }
        );
        setIsEditing(false);
        setValue('');
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
      <p>
        <AnimatePresence mode='wait' initial={false}>
          {isEditing ? (
            <motion.input
                       key='a'
                      name={id}
              defaultValue={value}
               placeholder='type here'
              autoComplete='off'
                  onChange={(e) => setValue(e.currentTarget.value)}
              {...slideInOut}
            />
          ) : (
            <motion.span key='b' {...slideInOut}>
              {text || fallback}
            </motion.span>
          )}
        </AnimatePresence>
      </p>
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
      <InfoField {...{ id: 'home',  user }} />
      <InfoField {...{ id: 'work',  user }} />
      <InfoField {...{ id: 'study', user }} />
      <InfoField {...{ id: 'bio',   user }} />
    </section>
  );
}
