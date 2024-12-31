import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import useFetch from '@/hooks/useFetch';
import Post from '@/models/Post';
import { useEffect } from 'react';

export default function FeedPage() {
  const { data: posts, setData, reqHandler, error, isLoading } = useFetch<Post[]>([]);
  const { reqHandler: sendPost } = useFetch<Post | null>(null);

  useEffect(() => {
    const getData = async () => {
      await reqHandler({ url: 'feed/posts' });
    };

    getData();
  }, [reqHandler]);

  async function clickHandler() {
    const post = await sendPost({
      url: 'feed/new-post',
      method: 'POST',
      data: {
        title: 'Number Two',
        content: 'This is number two.',
      },
    });
    if (post) {
      setData((prev) => [post, ...prev]);
    }
  }

  console.log('error', error, '\nisLoading', isLoading, '\ndata', posts);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button onClick={clickHandler}>New Post</button>
          <Feed feed={posts} />
        </>
      )}
    </>
  );
}
