import { useFetch } from "@/lib/hooks/useFetch";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePagedFetch } from "@/components/pagination/usePagedFetch";
import { useSocket } from "@/lib/hooks/useSocket";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import { ApiError } from "@/lib/http/fetchData";
import User from "@/models/User";
import Post from "@/models/Post";
import Reply from "@/models/Reply";
import Logger from "@/models/Logger";
import Meta from "@/components/meta/Meta";
import AsyncAwait from "@/components/ui/boundary/AsyncAwait";
import PostContent from "@/components/post/PostContent";
import ConfirmDialog from "@/components/ui/modal/ConfirmDialog";
import ReplyItem from "@/components/list/reply/ReplyItem";
import PagedList from "@/components/pagination/PagedList";
import FormSideBar from "@/components/form/forms/sidebar/FormSideBar";
import PostForm from "@/components/form/forms/post/PostForm";
import { getMeta } from "@/lib/util/getMeta";
import { api } from "@/lib/http/endpoints";

export default function PostPage({ user }: { user: User }) {
  const {
         data: post,
      setData: setPost,
      reqData: reqPost,
    isInitial,
    isLoading,
        error,
     setError, // !shouldFetch if !postId or post hasn't finished loading
  } = useFetch<Post | null>();
  const { postId } = useParams();
  const { setData: setReplies, ...rest } = usePagedFetch<Reply>(api.post.replies(postId), 5, !!postId && !!post);
  const [hasLoaded, setHasLoaded] = useState(false); // trigger for post state
  const [modalState,    setModal] = useState("");
  const navigate   = useNavigate();
  const socketRef  = useSocket("post");
  const closeModal = () => setModal("");

  useDepedencyTracker("post", { reqUser: user._id, postId });

  useEffect(() => {
    if (postId) reqPost({ url: api.feed.find(postId) });
  }, [postId, reqPost]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !postId) return;

    const logger = new Logger("post");
    socket.on("connect", () => logger.connect());

    const updatePostChannel = `post:${postId}:update`;
    const deletePostChannel = `post:${postId}:delete`;

    socket.on(updatePostChannel, (post) => {
      logger.event("post:update", post);
      setPost((prevPost) => {
        if (post) return { ...prevPost, ...post };
        return prevPost;
      });
      closeModal(); // viewers cannot open modals on this page
    });

    socket.on(deletePostChannel, (deleted) => {
      logger.event("post:delete", deleted);
      if (deleted.creator !== user._id) {
        setPost(null); // delete actions for viewers. Creator's state automatically set to null
        setError({ message: "The post was deleted" } as ApiError); // creators redirected without msg
      }
    });

    return () => {
      socket.off("connect");
      socket.off(updatePostChannel);
      socket.off(deletePostChannel); // deletes the post (& all replies)
    };
  }, [socketRef, user._id, postId, setError, setPost]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !postId || !hasLoaded) return;

    const logger = new Logger("post");

    const    newReplyChannel = `post:${postId}:reply:new`;
    const deleteReplyChannel = `post:${postId}:reply:delete`;

    socket.on(newReplyChannel, (reply) => {
      logger.event("reply:new", reply);
      setTimeout(() => {
        setReplies(({ docCount, items }) => {
          return { docCount: docCount + 1, items: [reply, ...items] };
        });
      }, 500); // delay so the <ChatBox> animates first, then this.
    });

    socket.on(deleteReplyChannel, (deleted) => {
      logger.event("reply:delete", deleted);
      setReplies(({ docCount: prevCount, items: prevReplies }) => {
        const items = prevReplies.filter(({ _id }) => _id !== deleted._id);
        const docCount = prevCount - 1;
        return { docCount, items };
      });
    });

    return () => {
      socket.off(newReplyChannel);
      socket.off(deleteReplyChannel); // deletes a reply to post
    };
  }, [hasLoaded, socketRef, postId, setReplies]);

  function deletePost() {
    if (!postId) return;
    reqPost({ url: api.post.delete(postId), method: "DELETE", onSuccess: () => navigate("/feed") });
    closeModal();
  }

  const { title, description } = getMeta(
    isInitial,
    post,
    (post) => ({ title: post.title, description: post.title }),
    "Post",
  );

  return (
    <>
      <Meta {...{ description }}>{title}</Meta>
      <FormSideBar open={modalState === "edit"} close={closeModal} text="Edit your post...">
        <PostForm {...{ isOpen: modalState === "edit", post }} />
      </FormSideBar>
      <ConfirmDialog open={modalState === "delete"} onConfirm={deletePost} onCancel={closeModal} />
      <AsyncAwait {...{ isInitial, isLoading, error }}>
        {post && <PostContent {...{ post, user, setModal, callback: () => setHasLoaded(true) }} />}
      </AsyncAwait>
      {hasLoaded && (
        <PagedList<Reply> header={{ fallback: { text: "Reply to this post", align: "end" } }} {...rest}>
          {(reply) => <ReplyItem {...reply} userId={user._id} />}
        </PagedList>
      )}
    </>
  );
}
