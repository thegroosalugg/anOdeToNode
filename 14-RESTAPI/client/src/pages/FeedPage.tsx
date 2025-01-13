import { useEffect, useRef, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { Auth } from './RootLayout';
import Post from '@/models/Post';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import FeedPanel from '@/components/post/FeedPanel';
import PostForm from '@/components/form/PostForm';
import { Pages, Paginated } from '@/components/pagination/Pagination';
import { captainsLog } from '@/util/captainsLog';

const initialData: Pick<Paginated<Post, 'posts'>, 'posts' | 'docCount'> = {
  docCount: 0,
     posts: [],
};

export default function FeedPage({ user, setUser, isLoading: fetchingUser }: Auth) {
  const {
          data: { docCount, posts },
       setData,
    reqHandler: initialReq,
         error,
     isLoading,
  } = useFetch(initialData);
  const { reqHandler: updateReq } = useFetch(initialData);
  const [showModal, setShowModal] = useState(false);
  const [pages,         setPages] = useState<Pages>([1, 1]);
  const isInitial = useRef(true);        // 0: prevPage, 1: currentPage
  const feedProps = {
    docCount, posts, error, isLoading, limit: 4, pages, setPages
  };
  const [, current] = pages;
  const url = `feed/posts?page=${current}`;

  useEffect(() => {
    const mountData = async () => {
      await initialReq({ url });
    };

    const updateData = async () => {
      await updateReq({ url }, { onSuccess: (updated) => setData(updated) });
    };

    if (isInitial.current) {
      isInitial.current = false;
      mountData();
      captainsLog(-100, 260, ['FEEDPAGE INITIAL'] ); // **LOGDATA
    } else {
      updateData();
      captainsLog(-100, 270, ['FEEDPAGE UPDATING'] ); // **LOGDATA
    }
  }, [updateReq, initialReq, setData, url, showModal]);

  const closeModal = () => setShowModal(false);

  return (
    <>
      <Modal show={showModal}           close={closeModal}>
        <PostForm setUser={setUser} onSuccess={closeModal} />
      </Modal>
      {fetchingUser ? (
        <p style={{ alignSelf: 'center' }}>Logging in...</p>
      ) : (
        user && (
          <Button
                hsl={[180, 80, 35]}
              style={{ margin: '0 auto 1rem' }}
            onClick={() => setShowModal(true)}
          >
            New Post
          </Button>
        )
      )}
      <FeedPanel {...feedProps} />
    </>
  );
}
