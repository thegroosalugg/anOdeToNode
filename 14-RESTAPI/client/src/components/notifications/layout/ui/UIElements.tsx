import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfilePic from '@/components/ui/image/ProfilePic';
import User from '@/models/User';
import { timeAgo } from '@/lib/util/timeStamps';
import css from './UIElements.module.css';

export function Strong({ callback, children }: { callback: () => void; children: ReactNode }) {
  return (
    <strong className={css['strong-tag']} onClick={callback}>
      {children}
    </strong>
  );
}

export function Time({ time }: { time: string }) {
  return <time className={css['time-stamp']}>{timeAgo(time)}</time>;
}

export function X({ callback }: { callback: () => void }) {
  return (
    <button className={css['x-btn']} onClick={callback}>
      <FontAwesomeIcon icon='x' size='xl' />
    </button>
  );
}

export function Alert({ user, children }: { user: User; children: ReactNode }) {
  return (
    <h2 className={css['alert-text']}>
      <ProfilePic {...{ user }} />
      <span>{children}</span>
    </h2>
  );
}
