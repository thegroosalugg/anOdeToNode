import { useState } from 'react';
import { usePages } from '@/hooks/usePagination';
import Friend from '@/models/Friend';
import PagedList from '../pagination/PagedList';
import PeerItem from '../social/PeerItem';

function paginate<T>(arr: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};

export default function FriendsList({ friends }: { friends: Friend[] }) {
  const { deferring, current, direction, changePage: setPage } = usePages();
  const friendsList = friends
    .filter(({ accepted }) => accepted)
    .map((item) => ({ ...item, _id: item.user._id }));
  // connection ID isnt needed in List, however user ID is needed in its place for navTo Fn

  const limit = 10; // must match pagedListConfig.ts
  const [pagedData, setPagedData] = useState(paginate(friendsList, current, limit));

  // hook function renamed & redefined with extra step setPagedData
  const changePage = (page: number) => {
    if (!deferring) setPagedData(paginate(friendsList, page, limit));
    setPage(page);// hook function sets deferring
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
