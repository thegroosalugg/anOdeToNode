import { useEffect } from "react";
import { useIsPresent } from "motion/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { useSocket } from "@/lib/hooks/useSocket";
import { usePagedFetch } from "@/components/pagination/usePagedFetch";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import { api } from "@/lib/http/endpoints";
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
  const { data: peer, isInitial, error, reqData } = useFetch<User | null>();
  const {  userId  } = useParams();
  const { pathname } = useLocation();
  const    isPresent = useIsPresent(); // returns false when component is exiting with <AnimatePresense>
  const    socketRef = useSocket("peer");
  const     navigate = useNavigate();
  // shouldFetch is userId defined and component isPresent (not exiting with <AnimatePresense>)
  const { setData, ...rest } = usePagedFetch<Post>(api.social.userPosts(userId), 4, !!userId && isPresent);

  useDepedencyTracker("peer", {
    pathname,
      userId,
     reqUser: user._id,
        peer: peer?._id,
    isPresent,
  });

  useEffect(() => {
    if (!isPresent) return;
    if (userId === user._id) {
      navigate("/");
      return;
    }

    if (userId) reqData({ url: api.social.findUser(userId) });
  }, [isPresent, userId, user._id, navigate, reqData]);

  useEffect(() => {
    if (!isPresent || !peer?._id) return; // cancel effects on dismount (AnimatePresense)

    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger("peer");
    if (socket.connected) logger.connect();

    const updateChannel = `post:${peer._id}:update`;
    const deleteChannel = `post:${peer._id}:delete`;

    socket.on(updateChannel, ({ post, isNew }) => {
      logger.event(`update, action: ${isNew ? "New" : "Edit"}`, post);
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const items = isNew ? [post, ...prevPosts] : prevPosts.map((prev) => (post._id === prev._id ? post : prev));

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
  }, [isPresent, socketRef, peer?._id, setData]);

  const { title, description } = getMeta(
    isInitial,
    peer,
    (peer) => ({ title: peer.name, description: `${peer.name}'s profile` }),
    "User",
  );

  const align = "end";

  return (
    <>
      <Meta {...{ description }}>{title}</Meta>
      <AsyncAwait {...{ isInitial, error }}>
        {peer && (
          <>
            <UserDashboard {...{ target: peer, watcher: user }}>
              <SocialActions {...{ user, peer }} />
            </UserDashboard>
            <FriendsList target={peer} watcher={user} />
            <PagedList<Post>
              header={{
                   title: { text: `${peer.name}'s posts`,                    align },
                fallback: { text: `${peer.name} hasn't posted anything yet`, align },
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
