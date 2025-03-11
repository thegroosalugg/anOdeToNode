import PeerItem from '../social/PeerItem';
import Friend from '@/models/Friend';
import PagedList from '../pagination/PagedList';
import { Direction, Pages } from '@/hooks/usePagination';
import { useState } from 'react';
import useDebounce from '@/hooks/useDebounce';

function paginate<T>(arr: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};

export default function FriendsList({ friends }: { friends: Friend[] }) {
  const { deferring, deferFn } = useDebounce();
  const [pages,      setPages] = useState<Pages>([1, 1]);
  const [previous,    current] = pages;
  const direction: Direction   = previous < current ? 1 : -1;
  const friendsList = friends
    .filter(({ accepted }) => accepted)
    .map((item) => ({ ...item, _id: item.user._id }));
  // connection ID isnt needed in List, however user ID is needed in its place for navTo Fn

  const limit = 10;
  const [pagedData, setPagedData] = useState(paginate(friendsList, current, limit));

  const changePage = (page: number) => {
    deferFn(() => {
      setPages([current, page]);
      setPagedData(paginate(friendsList, page, limit));
    }, 1200);
  };

  const props = {
          data: { docCount: friendsList.length, items: pagedData },
       current,
     direction,
    changePage,
     deferring,
  };

  return (
    <PagedList<Friend> {...{ ...props, config: 'friends' }}>
      {(friend) => <PeerItem user={friend.user} />}
    </PagedList>
  );
}
