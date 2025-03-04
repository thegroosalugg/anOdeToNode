import { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import useInitial from '@/hooks/useInitial';
import { Authorized } from '@/pages/RootLayout';
import Post from '@/models/Post';
import About from './About';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import { Pages, Paginated } from '../pagination/Pagination';
import ConfirmDialog from '../dialog/ConfirmDialog';
import AsyncAwait from '../panel/AsyncAwait';
import PagedList from '../pagination/PagedList';
import PostItem from '../post/PostItem';
import css from './UserProfile.module.css';

const initialData: Paginated<Post, 'posts'> = {
  docCount: 0,
     posts: [],
};

export default function UserProfile({ user, setUser }: Authorized) {
  const {
          data: { docCount, posts },
         error,
    reqHandler,
  } = useFetch(initialData);
  const { isInitial,  mountData } = useInitial();
  const [showModal, setShowModal] = useState(false);
  const [pages,         setPages] = useState<Pages>([1, 1]);
  const [,               current] = pages;
  const                      url  = `profile/posts?page=${current}`;

  const aboutProps = { user, setUser }
  const  feedProps = {
          type: 'profile' as const,
         items: posts,
         pages,
      setPages,
      docCount,
  };

  useEffect(() => {
    const initData = async () => mountData(async () => await reqHandler({ url }), 6);
    initData();
  }, [reqHandler, mountData, url]);

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
      <section className={css['user-profile']}>
        <About {...aboutProps} />
        <AsyncAwait {...{ isLoading: isInitial, error }}>
          <PagedList<Post> {...feedProps}>
            {(post) => <PostItem {...post} onUserPage />}
          </PagedList>
        </AsyncAwait>
        <Button
              hsl={[10, 54, 51]}
          onClick={() => setShowModal(true)}
          animate={{ opacity: 1, transition: { opacity: { delay: 2.2 }} }}
        >
          Logout
        </Button>
      </section>
    </>
  );
}
