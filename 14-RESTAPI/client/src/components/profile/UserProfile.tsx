import useFetch from '@/hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import { Auth } from '@/pages/RootLayout';
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

export default function UserProfile({ user, setUser }: Auth) {
  const {
          data: { docCount, posts },
       setData,
     isLoading,
         error,
    reqHandler: initialReq,
  } = useFetch(initialData);
  const                isInitial  = useRef(true);
  const { reqHandler: updateReq } = useFetch(initialData);
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
    const  mountData = async () => await initialReq({ url });

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
    closeModal();
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
          <PagedList <Post> {...feedProps}>
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
