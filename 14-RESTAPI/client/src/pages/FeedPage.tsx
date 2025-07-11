import { useEffect, useState } from "react";
import { usePagedFetch } from "@/components/pagination/usePagedFetch";
import { useSocket } from "@/lib/hooks/useSocket";
import { Authorized } from "@/lib/types/auth";
import Post from "@/models/Post";
import Logger from "@/models/Logger";
import Button from "@/components/ui/button/Button";
import AsyncAwait from "@/components/ui/boundary/AsyncAwait";
import PagedList from "@/components/pagination/PagedList";
import PostItem from "@/components/list/post/PostItem";
import FormSideBar from "@/components/form/forms/sidebar/FormSideBar";
import PostForm from "@/components/form/forms/post/PostForm";

export default function FeedPage({ setUser }: Authorized) {
  const {
    fetcher: { setData, isLoading, error },
    ...rest
  } = usePagedFetch<Post>("feed/posts", 3);
  const socketRef = useSocket("feed");
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger("feed");
    socket.on("connect", () => logger.connect());

    const updateChannel = "post:update";
    const deleteChannel = "post:delete";

    socket.on(updateChannel, ({ post, isNew }) => {
      logger.event(`update, action: ${isNew ? "New" : "Edit"}`, post);
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const items = isNew
          ? [post, ...prevPosts]
          : prevPosts.map((prev) => (post._id === prev._id ? post : prev));

        const docCount = prevCount + (isNew ? 1 : 0);
        return { docCount, items };
      });
    });

    socket.on(deleteChannel, (deleted) => {
      logger.event("delete", deleted);
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const items = prevPosts.filter(({ _id }) => _id !== deleted._id);
        const docCount = prevCount - 1;
        return { docCount, items };
      });
    });

    return () => {
      socket.off("connect");
      socket.off(updateChannel);
      socket.off(deleteChannel);
    };
  }, [socketRef, setData]);

  return (
    <>
      <FormSideBar open={isOpen} close={closeModal} text="Make a post!">
        <PostForm {...{ isOpen, setUser, onSuccess: closeModal }} />
      </FormSideBar>
      <Button
           onClick={() => setIsOpen(true)}
             style={{ margin: "0 auto 0.5rem" }}
        animations={{ transition: { opacity: { delay: 0.5 } } }}
      >
        New Post
      </Button>
      <AsyncAwait {...{ isLoading, error }}>
        <PagedList<Post>
            path="post"
          header={{ title: ["User posts"], fallback: ["Slow news day", "center"] }}
          {...rest}
        >
          {(post) => <PostItem {...post} />}
        </PagedList>
      </AsyncAwait>
    </>
  );
}
