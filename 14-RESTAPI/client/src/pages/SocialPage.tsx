import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import { usePagedFetch } from "@/components/pagination/usePagedFetch";
import { useSocket } from "@/lib/hooks/useSocket";
import User from "@/models/User";
import Logger from "@/models/Logger";
import AsyncAwait from "@/components/ui/boundary/AsyncAwait";
import PagedList from "@/components/pagination/PagedList";
import UserItem from "@/components/list/user/UserItem";
import { Authorized } from "@/lib/types/auth";
import css from "@/components/list/user/FriendsList.module.css";

export default function SocialPage({ user }: Authorized) {
  const {
    fetcher: { setData, isLoading, error },
    ...rest
  } = usePagedFetch<User>("social/users", isMobile ? 8 : 10);
  const socketRef = useSocket("social");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger("social");
    socket.on("connect", () => logger.connect());

    socket.on("user:new", (newUser) => {
      logger.event("user:new", newUser);
      setData(({ docCount, items }) => ({
        docCount: docCount + 1,
        items: [newUser, ...items],
      }));
    });

    return () => {
      socket.off("connect");
      socket.off("user:new");
    };
  }, [socketRef, setData]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      <PagedList<User>
        className={`${css["user-list"]} no-scrollbar-y`}
             path="user"
           header={{ title: ["Users"], fallback: ["Nobody here", "center"] }}
        {...rest}
        whileHover={{ y: -2, transition: { ease: "linear", duration: 0.2 } }}
      >
        {(peer) => <UserItem target={peer} watcher={user} />}
      </PagedList>
    </AsyncAwait>
  );
}
