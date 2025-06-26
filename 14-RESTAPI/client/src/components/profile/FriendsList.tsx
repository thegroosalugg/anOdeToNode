import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { usePages } from '@/lib/hooks/usePagination';
import Friend from '@/models/Friend';
import PagedList from '../pagination/PagedList';
import PeerItem from '../social/PeerItem';

function paginate<T>(arr: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};

export default function FriendsList({
  friends,
   mutual,
}: {
  friends: Friend[];
  mutual?: boolean;
}) {
  const { deferring, current, direction, changePage: setPage } = usePages();
  const friendsList = friends.filter(({ accepted }) => accepted);

  const limit = isMobile ? 4 : 5;
  const [pagedData, setPagedData] = useState(paginate(friendsList, current, limit));

  useEffect(() => {
    setPagedData((prev) => {
      const newPage = paginate(friendsList, current, limit);
      // .some fails on reference mismatch, always triggering newPage.
      // React re-renders only on prop value changes, not new refs.
      // therefore if a new friend is added, this will also updated pagedData, not just removals
      return prev.length > newPage.length || prev.some((f) => !friendsList.includes(f))
        ? newPage
        : prev;
    });
  }, [friendsList, current, limit]);

  // hook function renamed & redefined with extra step setPagedData
  const changePage = (page: number) => {
    if (!deferring) setPagedData(paginate(friendsList, page, limit));
    setPage(page); // hook function sets deferring
  };

  const props = {
          data: { docCount: friendsList.length, items: pagedData },
       current,
     direction,
    changePage,
     deferring,
  };

  return (
    <PagedList<Friend> {...{ ...props, limit, config: mutual ? 'mutual' : 'friends' }}>
      {(friend) => <PeerItem user={friend.user} />}
    </PagedList>
  );
}
