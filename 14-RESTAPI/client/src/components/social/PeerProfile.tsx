import { motion } from 'motion/react';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import css from './PeerProfile.module.css';

export default function PeerProfile({ peer }: { peer: User }) {
  const { name, surname } = peer;

  return (
    <motion.section
      className={css['peer-profile']}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.5 } }}
    >
      <div>
        <ProfilePic user={peer} />
        <h2>
          {name} {surname}
        </h2>
      </div>
    </motion.section>
  );
}
