import { useEffect, useRef, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { AuthProps } from './RootLayout';
import Post from '@/models/Post';
import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import PostForm from '@/components/form/PostForm';
import Error from '@/components/error/Error';
import Pagination, { Pages } from '@/components/pagination/Pagination';

const initialData = { docCount: 0, posts: [] };

export default function FeedPage({ user, isLoading: fetchingUser }: AuthProps) {
  const {
          data,
       setData,
    reqHandler: initialReq,
         error,
     isLoading,
  } = useFetch<Pages<Post, 'posts'>>(initialData);
  const { reqHandler: updateReq } = useFetch<Pages<Post, 'posts'>>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [pages,         setPages] = useState([1, 1]); // 0: prevPage, 1: currentPage
  const isInitial = useRef(true);

  useEffect(() => {
    const mountData = async () => {
      await initialReq({ url: `feed/posts?page=${pages[1]}` });
    };

    const updateData = async () => {
      const updatedData = await updateReq({ url: `feed/posts?page=${pages[1]}` });
      setData(updatedData);
    };

    if (isInitial.current) {
      isInitial.current = false;
      mountData();
      console.log('FEEDPAGE INITIAL'); // **LOGDATA
    } else {
      updateData();
      console.log('FEEDPAGE UPDATING'); // **LOGDATA
    }
  }, [updateReq, initialReq, setData, pages, showModal]);

  return (
    <>
      <Modal show={showModal} close={() => setShowModal(false)}>
        <PostForm          callback={() => setShowModal(false)} />
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
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <Feed data={data} pages={pages} />
      )}
      {data.docCount > 4 && (
        <Pagination
                limit={4}
             docCount={data.docCount}
             isActive={pages[1]}
          setIsActive={setPages}
        />
      )}
    </>
  );
}
