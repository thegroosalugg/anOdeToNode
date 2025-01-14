import useFetch from '@/hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import { Auth } from '@/pages/RootLayout';
import Post from '@/models/Post';
import About from './About';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import Pagination, { Pages, Paginated } from '../pagination/Pagination';
import ConfirmDialog from '../dialog/ConfirmDialog';
import css from './UserProfile.module.css';
import AsyncAwait from '../panel/AsyncAwait';
import PostFeed from '../post/PostFeed';
import useDebounce from '@/hooks/useDebounce';

const initialData: Pick<Paginated<Post, 'posts'>, 'posts' | 'docCount'> = {
  docCount: 0,
     posts: [],
};

export default function UserProfile({ user, setUser }: Auth) {
  const {
          data: { docCount, posts },
       setData,
     isLoading,
         error,
    reqHandler: initialReq,
  } = useFetch(initialData);
  const               isInitial   = useRef(true);
  const { reqHandler: updateReq } = useFetch(initialData);
  const { deferring,    deferFn } = useDebounce();
  const [showModal, setShowModal] = useState(false);
  const [pages,         setPages] = useState<Pages>([1, 1]);
  const [,               current] = pages;
  const                      url  = `profile/posts?page=${current}`;

  const aboutProps = { user, setUser }
  const  feedProps = { docCount, limit: 6, pages, setPages, deferring, deferFn, alternate: true };

  useEffect(() => {
    const mountData = async () => await initialReq({ url });

    const updateData = async () =>
      await updateReq({ url }, { onSuccess: (updated) => setData(updated) });

    if (isInitial.current) {
      isInitial.current = false;
      mountData();
    } else {
      updateData();
    }

  }, [initialReq, updateReq, setData, url]);

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
        <AsyncAwait {...{ isLoading, error }}>
          <PostFeed posts={posts} {...feedProps} />
          <Pagination {...feedProps} />
        </AsyncAwait>
        <Button hsl={[10, 54, 51]} onClick={() => setShowModal(true)}>
          Logout
        </Button>
      </section>
    </>
  );
}
