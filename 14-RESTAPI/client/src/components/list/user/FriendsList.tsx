import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { usePages } from "@/lib/hooks/usePages";
import User from "@/models/User";
import Friend from "@/models/Friend";
import PagedList from "../../pagination/PagedList";
import UserItem from "./UserItem";
import css from "./FriendsList.module.css";

function paginate<T>(arr: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
}

export default function FriendsList({ target, watcher }: { target: User; watcher?: User }) {
  const { deferring, currentPage, direction, changePage: setPage } = usePages();

  if (!watcher) watcher = target;
  const friendsList = Friend.getMutuals({ target, watcher });

  const limit = isMobile ? 4 : 5;
  const [pagedData, setPagedData] = useState(paginate(friendsList, currentPage, limit));

  useEffect(() => {
    setPagedData((prev) => {
      const newPage = paginate(friendsList, currentPage, limit);
      // .some returns false on reference mismatch, always triggering newPage.
      // React re-renders only on prop value changes, not new refs.
      // therefore if a new friend is added, this will also updated pagedData, not just removals
      return prev.length > newPage.length || prev.some((f) => !friendsList.includes(f))
        ? newPage
        : prev;
    });
  }, [friendsList, currentPage, limit]);

  // hook function renamed & redefined with extra step setPagedData
  const changePage = (page: number) => {
    if (!deferring) setPagedData(paginate(friendsList, page, limit));
    setPage(page); // hook function sets deferring
  };

  const props = {
           data: { docCount: friendsList.length, items: pagedData },
    currentPage,
      direction,
     changePage,
      deferring,
          limit,
  };

  const isSelf   = watcher === target;
  const title    = { text: isSelf ? "Your friends"                  : `${target.name}'s friends` };
  const fallback = { text: isSelf ? "Your friends will appear here" : "No mutual friends"        };

  return (
    <PagedList<Friend>
      className={`${css["user-list"]} no-scrollbar-y`}
         header={{ title, fallback }}
      {...props}
    >
      {({ user }) =>
        typeof user === "object" && <UserItem target={user} watcher={watcher} />
      }
    </PagedList>
  );
}
