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
    isLoading,
        error,
     setError,
  } = useFetch<Post | null>();
  const { postId } = useParams();
  // usePagedFetch won't send request if postId undefined
  const { setData: setReplies, ...rest } = usePagedFetch<Reply>(api.post.replies(postId ?? ""), 5, !!postId);
  const [modalState,    setModal] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const   navigate = useNavigate();
  const  socketRef = useSocket("post");
  const closeModal = () => setModal("");

  useDepedencyTracker("post", { reqUser: user._id, postId });

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || hasLoaded) return;
      await reqPost({ url: api.feed.find(postId) });
      setTimeout(() => setHasLoaded(true), 1000); // *TEMP FIX FOR STAGGER
    };

    fetchPost();
  }, [postId, hasLoaded, reqPost]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !postId) return;

    const logger = new Logger("post");
    socket.on("connect", () => logger.connect());

    const    newReplyChannel = `post:${postId}:reply:new`;
    const deleteReplyChannel = `post:${postId}:reply:delete`;
    const  updatePostChannel = `post:${postId}:update`;
    const  deletePostChannel = `post:${postId}:delete`;

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
      socket.off(newReplyChannel);
      socket.off(deleteReplyChannel); // deletes a reply to post
      socket.off(updatePostChannel);
      socket.off(deletePostChannel); // deletes the post (& all replies)
    };
  }, [socketRef, user._id, postId, setError, setPost, reqPost, setReplies]);

  const onSuccess = () => {
    closeModal(); // delete actions for creator
    navigate("/feed");
  };

  const onError = () => {
    closeModal();
  };

  async function deletePost() {
    if (!postId) return;
    await reqPost({ url: api.post.delete(postId), method: "DELETE", onSuccess, onError });
  }

  const { title, description } = getMeta(
    isLoading,
    post,
    (post) => ({ title: post.title, description: post.title }),
    "Post"
  );

  return (
    <>
      <Meta {...{ description }}>{title}</Meta>
      <FormSideBar open={modalState === "edit"} close={closeModal} text="Edit your post...">
        <PostForm {...{ isOpen: modalState === "edit", post }} />
      </FormSideBar>
      <ConfirmDialog
             open={modalState === "delete"}
        onConfirm={deletePost}
         onCancel={closeModal}
      />
      <AsyncAwait {...{ isLoading, error }}>
        {post && (
          <>
            <PostContent {...{ post, user, setModal }} />
            <PagedList<Reply>
              header={{ fallback: { text: "Reply to this post", align: "end" }}}
               delay={hasLoaded ? 0 : 2.5} // *TEMP FIX FOR STAGGER
              {...rest}
            >
              {(reply) => <ReplyItem {...reply } userId={user._id} />}
            </PagedList>
          </>
        )}
      </AsyncAwait>
    </>
  );
}
