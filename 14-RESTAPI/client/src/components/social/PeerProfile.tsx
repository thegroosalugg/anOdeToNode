import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import Button from '../button/Button';
import css from './PeerProfile.module.css';

export default function PeerProfile({ peer }: { peer: User }) {
  const { _id, name, surname } = peer;
  const { reqHandler } = useFetch();

  async function clickHandler() {
    await reqHandler({ url: `social/add/${_id}`, method: 'POST' });
  }

  return (
    <motion.section
      className={css['peer-profile']}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.5 } }}
    >
      <div className={css['profile-pic']}>
        <div>
          <ProfilePic user={peer} />
          <h2>
            {name} {surname}
          </h2>
        </div>
        <Button hsl={[0, 0, 89]} onClick={clickHandler}>
          Add Friend
          <FontAwesomeIcon icon='user-plus' size='xs' />
        </Button>
      </div>
    </motion.section>
  );
}
