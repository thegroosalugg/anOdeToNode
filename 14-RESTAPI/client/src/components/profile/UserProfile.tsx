import { motion } from 'motion/react';
import { useState } from 'react';
import usePagination from '@/hooks/usePagination';
import { Authorized } from '@/pages/RootLayout';
import Post from '@/models/Post';
import ProfileHeader from './ProfileHeader';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import ConfirmDialog from '../dialog/ConfirmDialog';
import AsyncAwait from '../panel/AsyncAwait';
import FriendsList from './FriendsList';
import PagedList from '../pagination/PagedList';
import PostItem from '../post/PostItem';
import css from './UserProfile.module.css';

export default function UserProfile({ user, setUser }: Authorized) {
  const {
    fetcher: { isLoading, error },
     ...rest
  } = usePagination<Post>('profile/posts');
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  function logout() {
    closeModal();
    setUser(null);
    localStorage.removeItem('jwt-access');
    localStorage.removeItem('jwt-refresh');
  }

  return (
    <>
      <Modal show={showModal}                close={closeModal}>
        <ConfirmDialog onConfirm={logout} onCancel={closeModal} />
      </Modal>
      <motion.section
        className={css['user-profile']}
             exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <ProfileHeader {...{ user, setUser }} />
        <FriendsList friends={user.friends} />
        <AsyncAwait {...{ isLoading, error }}>
          <PagedList<Post> {...{ ...rest, config: 'userPosts' }}>
            {(post) => <PostItem {...post} isCreator />}
          </PagedList>
        </AsyncAwait>
        <Button
              hsl={[10, 54, 51]}
          onClick={() => setShowModal(true)}
          animate={{ opacity: 1, transition: { opacity: { delay: 2.2 }} }}
        >
          Logout
        </Button>
      </motion.section>
    </>
  );
}
