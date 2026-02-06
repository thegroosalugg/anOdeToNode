import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import { usePagedFetch } from "@/components/pagination/usePagedFetch";
import { useSocket } from "@/lib/hooks/useSocket";
import User from "@/models/User";
import Logger from "@/models/Logger";
import AsyncAwait from "@/components/ui/boundary/AsyncAwait";
import PagedList from "@/components/pagination/PagedList";
import UserItem from "@/components/list/user/UserItem";
import css from "@/components/list/user/FriendsList.module.css";
import { api } from "@/lib/http/endpoints";

export default function SocialPage({ user }: { user: User }) {
  const {
    fetcher: { setData, isLoading, error },
    ...rest
  } = usePagedFetch<User>(api.social.users, isMobile ? 8 : 10);
  const socketRef = useSocket("social");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger("social");
    socket.on("connect", () => logger.connect());

    const newChannel = "user:new";

    socket.on(newChannel, (newUser) => {
      logger.event(newChannel, newUser);
      setData(({ docCount, items }) => ({
        docCount: docCount + 1,
        items: [newUser, ...items],
      }));
    });

    return () => {
      socket.off("connect");
      socket.off(newChannel);
    };
  }, [socketRef, setData]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      <PagedList<User>
        className={css["user-list"]}
             path="user"
           header={{ title: { text: "Users" }, fallback: { text: "Nobody here", align: "center" }}}
        {...rest}
        whileHover={{ y: -2, transition: { ease: "linear", duration: 0.2 } }}
      >
        {(peer) => <UserItem target={peer} watcher={user} />}
      </PagedList>
    </AsyncAwait>
  );
}
