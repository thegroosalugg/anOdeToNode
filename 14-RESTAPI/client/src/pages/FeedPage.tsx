import Feed from "@/components/feed/Feed";
import useFetch from "@/hooks/useFetch";
import Post from "@/models/Post";
import { useEffect } from "react";

export default function FeedPage() {
  const { error, isLoading, data, reqHandler } = useFetch<Post[]>([]);

  useEffect(() => {
    const getData = async () => {
      await reqHandler({ url: 'feed/posts' })
    }

    getData();
  }, [reqHandler])

  console.log('error', error, '\nisLoading', isLoading, '\ndata', data);

  return (
    <>
      {isLoading ? <div>Loading...</div> : <Feed feed={data} />}
    </>
  );
}
