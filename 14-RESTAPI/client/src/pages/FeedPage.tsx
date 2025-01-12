import { useEffect, useRef, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { AuthProps } from './RootLayout';
import { FetchError } from '@/util/fetchData';
import Post from '@/models/Post';
import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import PostForm from '@/components/form/PostForm';
import Error from '@/components/error/Error';
import Pagination, { Pages } from '@/components/pagination/Pagination';
import { captainsLog } from '@/util/captainsLog';

const initialData = { docCount: 0, posts: [] };

export default function FeedPage({ user, setUser, isLoading: fetchingUser }: AuthProps) {
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
      if (updatedData) setData(updatedData);
    };

    if (isInitial.current) {
      isInitial.current = false;
      mountData();
      captainsLog(-100, 260, ['FEEDPAGE INITIAL'] ); // **LOGDATA
    } else {
      updateData();
      captainsLog(-100, 270, ['FEEDPAGE UPDATING'] ); // **LOGDATA
    }
  }, [updateReq, initialReq, setData, pages, showModal]);

  function on401(err: FetchError) {
    if (err.status === 401) setUser(null);
  }

  return (
    <>
      <Modal show={showModal}       close={() => setShowModal(false)}>
        <PostForm on401={on401} onSuccess={() => setShowModal(false)} />
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
