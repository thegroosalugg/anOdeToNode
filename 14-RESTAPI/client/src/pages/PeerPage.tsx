import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { useSocket } from "@/lib/hooks/useSocket";
import { usePagedFetch } from "@/components/pagination/usePagedFetch";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import User from "@/models/User";
import Post from "@/models/Post";
import Logger from "@/models/Logger";
import Meta from "@/components/meta/Meta";
import AsyncAwait from "@/components/ui/boundary/AsyncAwait";
import UserDashboard from "@/components/user/dashboard/UserDashboard";
import FriendsList from "@/components/list/user/FriendsList";
import PagedList from "@/components/pagination/PagedList";
import PostItem from "@/components/list/post/PostItem";
import SocialActions from "@/components/user/actions/peer/SocialActions";
import { getMeta } from "@/lib/util/getMeta";

export default function PeerPage({ user }: { user: User }) {
  const { data: peer, isLoading, error, reqData } = useFetch<User | null>();
  const { userId } = useParams();
  const {
    fetcher: { setData },
    ...rest
  } = usePagedFetch<Post>(`social/posts/${userId}`, 4, !!userId); // refetches only if userId exists
  const navigate = useNavigate();
  const socketRef = useSocket("peer");
  const { pathname } = useLocation();
  const isWrongPath = !pathname.startsWith("/user"); // <AnimatePresence> dismounts

  useDepedencyTracker("peer", {
    pathname,
      userId,
     reqUser: user._id,
        peer: peer?._id,
  });

  useEffect(() => {
    if (isWrongPath) return;
    if (userId === user._id) {
      navigate("/");
      return;
    }

    if (userId) reqData({ url: `social/find/${userId}` });
  }, [isWrongPath, userId, user._id, navigate, reqData]);

  useEffect(() => {
    if (isWrongPath || !peer?._id) return; // cancel effects on dismount (AnimatePresense)

    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger("peer");
    if (socket.connected) logger.connect();

    const updateChannel = `post:${peer._id}:update`;
    const deleteChannel = `post:${peer._id}:delete`;

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
      if (socket.connected) {
        socket.off(updateChannel);
        socket.off(deleteChannel);
      }
    };
  }, [isWrongPath, socketRef, peer?._id, setData]);

  const { title, description } = getMeta(
    isLoading,
    peer,
    (peer) => ({ title: peer.name, description: `${peer.name}'s profile` }),
    "User"
  );

  return (
    <>
      <Meta {...{ description }}>{title}</Meta>
      <AsyncAwait {...{ isLoading, error }}>
        {peer && (
          <>
            <UserDashboard {...{ target: peer, watcher: user }}>
              <SocialActions {...{ user, peer }} />
            </UserDashboard>
            <FriendsList target={peer} watcher={user} />
            <PagedList<Post>
              path="post"
              header={{
                title: [`${peer.name}'s posts`, "end"],
                fallback: [`${peer.name} hasn't posted anything yet`, "end"],
              }}
              {...rest}
            >
              {(post) => <PostItem {...post} />}
            </PagedList>
          </>
        )}
      </AsyncAwait>
    </>
  );
}
