import useFetch from '@/hooks/useFetch';
import { useEffect, useState } from 'react';
import { Auth } from '@/pages/RootLayout';
import Post from '@/models/Post';
import About from './About';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import ConfirmDialog from '../dialog/ConfirmDialog';
import css from './UserProfile.module.css';

export default function UserProfile({ user, setUser }: Auth) {
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line
  const { data: posts, setData, isLoading, error, reqHandler } = useFetch<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => await reqHandler({ url: 'profile/posts' });
    getPosts();
  }, [reqHandler])


  function closeModal() {
    setShowModal(false);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('jwt-access');
    localStorage.removeItem('jwt-refresh');
  }

  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <ConfirmDialog onConfirm={logout} onCancel={closeModal} />
      </Modal>
      <section className={css['user-profile']}>
        <About user={user} setUser={setUser} />
        <Button hsl={[10, 54, 51]} onClick={() => setShowModal(true)}>
          Logout
        </Button>
      </section>
    </>
  );
}
