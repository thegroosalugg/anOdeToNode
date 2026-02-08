import { isMobile } from "react-device-detect";
import { useCallback, useEffect, useState } from "react";
import { usePages } from "@/lib/hooks/usePages";
import User from "@/models/User";
import Friend from "@/models/Friend";
import PagedList from "../../pagination/PagedList";
import UserItem from "./UserItem";
import css from "./FriendsList.module.css";

export default function FriendsList({ target, watcher }: { target: User; watcher?: User }) {
  if (!watcher) watcher = target;

  const { deferring, currentPage, direction, setPageDirection, createArraySlice } = usePages();

  const limit = isMobile ? 4 : 5;
  const friendsList = Friend.getMutuals({ target, watcher });

  const createFriendsSlice = useCallback(
    (page: number = currentPage) => createArraySlice(friendsList, page, limit),
    [friendsList, currentPage, limit, createArraySlice],
  );

  const [pagedData, setPagedData] = useState(createFriendsSlice());

  useEffect(() => {
    setPagedData((prev) => {
      const newPage = createFriendsSlice();
      // .some returns false on reference mismatch, always triggering newPage.
      // React re-renders only on prop value changes, not new refs.
      // therefore if a new friend is added, this will also updated pagedData, not just removals
      return prev.length > newPage.length || prev.some((f) => !friendsList.includes(f)) ? newPage : prev;
    });
  }, [createFriendsSlice, friendsList]);

  // hook function renamed & redefined with extra step setPagedData
  const changePage = (page: number) => {
    setPagedData(createFriendsSlice(page));
    setPageDirection(page); // hook function sets deferring
  };

  const isSelf   = watcher === target;
  const title    = { text: isSelf ? "Your friends"                  : `${target.name}'s friends` };
  const fallback = { text: isSelf ? "Your friends will appear here" : "No mutual friends"        };

  const props = {
      className: `${css["user-list"]} no-scrollbar-y`,
         header: { title, fallback },
           data: { docCount: friendsList.length, items: pagedData },
    currentPage,
      direction,
     changePage,
      deferring,
          limit,
  };

  return (
    <PagedList<Friend> {...props}>
      {({ user }) =>
        Friend.isUser(user) && <UserItem target={user} watcher={watcher} />
      }
    </PagedList>
  );
}
