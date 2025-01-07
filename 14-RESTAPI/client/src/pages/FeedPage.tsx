import { useEffect, useRef, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';
import Post from '@/models/Post';
import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import PostForm from '@/components/form/PostForm';
import Error from '@/components/error/Error';
import Pagination, { Pages } from '@/components/pagination/Pagination';

const initialData = { docCount: 0, posts: [] };

export default function FeedPage() {
  const {
          data,
       setData,
    reqHandler: initialReq,
         error,
     isLoading,
  } = useFetch<Pages<Post, 'posts'>>(initialData);
  const {             reqHandler: updateReq } = useFetch<Pages<Post, 'posts'>>(initialData);
  const { data: user, reqHandler: fetchUser } = useFetch<User>();
  const [  showModal,          setShowModal ] = useState(false);
  const [      pages,              setPages ] = useState([1, 1]); // 0: prevPage, 1: currentPage
  const isInitial = useRef(true);

  useEffect(() => {
    const mountData = async () => {
      await Promise.all([
        initialReq({ url: `feed/posts?page=${pages[1]}` }),
         fetchUser({ url: 'user' })
      ]);
    };

    const updateData = async () => {
      const updatedData = await updateReq({ url: `feed/posts?page=${pages[1]}` });
      setData(updatedData);
    };

    if (isInitial.current) {
      isInitial.current = false;
      mountData();
      console.log('IS INITIAL'); // **LOGDATA
    } else {
      updateData();
      console.log('UPDATING'); // **LOGDATA
    }
  }, [updateReq, initialReq, fetchUser, setData, pages, showModal]);

  return (
    <>
      <Modal show={showModal} close={() => setShowModal(false)}>
        <PostForm          callback={() => setShowModal(false)} />
      </Modal>
      {user && (
        <Button
              hsl={[180, 80, 35]}
            style={{ margin: '0 auto 1rem' }}
          onClick={() => setShowModal(true)}
        >
          New Post
        </Button>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <Feed feed={data.posts} pages={pages} />
      )}
      <Pagination
              limit={4}
           docCount={data.docCount}
           isActive={pages[1]}
        setIsActive={setPages}
      />
    </>
  );
}
