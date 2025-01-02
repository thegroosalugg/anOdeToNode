import { useEffect } from 'react';
import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import useFetch from '@/hooks/useFetch';
import Post from '@/models/Post';

export default function FeedPage() {
  const {
          data: posts,
       setData,
    reqHandler: initialReq,
         error,
     isLoading,
  } = useFetch<Post[]>([]);
  const { reqHandler: updateReq } = useFetch<Post[]>([]);
  const {
          data: newPost,
         error: postErr,
    reqHandler: postReq,
  } = useFetch<Post | null>(null);

  useEffect(() => {
    const mountData = async () => await initialReq({ url: 'feed/posts' });
    mountData();
  }, [initialReq]);

  useEffect(() => {
    const updateData = async () => {
      const updatedData = await updateReq({ url: 'feed/posts' });
      setData(updatedData);
    };
    updateData();
  }, [updateReq, setData, newPost]);

  async function clickHandler() {
    await postReq({
         url: 'feed/new-post',
      method: 'POST',
        data: {
          title: 'Number Two',
        content: 'This is number two.',
      },
    });
  }

  console.log(
          'error', error, postErr,
  //   '\nisLoading', isLoading,
  //        '\ndata', posts,
  //     '\nnewPost', newPost
  ); // **LOGDATA

  return (
    <>
      <button onClick={clickHandler}>New Post</button>
      {postErr && <p>{postErr.message}</p>}
      {isLoading ? <Loader /> : error ? <p>{error.message}</p> : <Feed feed={posts} />}
    </>
  );
}
