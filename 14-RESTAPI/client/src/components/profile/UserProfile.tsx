import useFetch from '@/hooks/useFetch';
import { useEffect, useState } from 'react';
import { Auth } from '@/pages/RootLayout';
import Post from '@/models/Post';
import About from './About';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import FeedPanel from '../post/FeedPanel';
import { Pages, Paginated } from '../pagination/Pagination';
import ConfirmDialog from '../dialog/ConfirmDialog';
import css from './UserProfile.module.css';

const initialData: Pick<Paginated<Post, 'posts'>, 'posts' | 'docCount'> = {
  docCount: 0,
     posts: [],
};

export default function UserProfile({ user, setUser }: Auth) {
  const [showModal, setShowModal] = useState(false);
  const [pages,  setPages] = useState<Pages>([1, 1]);
  const [, current] = pages;

  const {
          data: { docCount, posts },
     isLoading,
         error,
    reqHandler,
  } = useFetch(initialData);
  const aboutProps = { user, setUser }
  const  feedProps = { docCount, posts, isLoading, error, limit: 8, pages, setPages };

  useEffect(() => {
    const getPosts = async () => await reqHandler({ url: `profile/posts?page=${current}` });
    getPosts();
  }, [reqHandler, current]);

  const closeModal = () => setShowModal(false);

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
        <About    {...aboutProps} />
        <FeedPanel {...feedProps} />
        <Button hsl={[10, 54, 51]} onClick={() => setShowModal(true)}>
          Logout
        </Button>
      </section>
    </>
  );
}
