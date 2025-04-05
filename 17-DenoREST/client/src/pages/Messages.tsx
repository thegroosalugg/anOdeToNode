import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import Msg from '@/models/Msg';
import Textarea from '@/components/form/Textarea';
import List from '@/components/list/List';
import MsgItem from '@/components/list/MsgItem';

export default function Messages() {
  const { data, setData, isLoading, reqHandler } = useFetch<Msg[]>([]);

  useEffect(() => {
    const getMsgs = async () => reqHandler({ url: 'all' });
    getMsgs();
  }, [reqHandler]);

  return (
    <>
      <Textarea<Msg[]> {...{ url: 'new', setData }} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List items={data}>
          {(msg) => <MsgItem key={msg._id} {...{ msg, setData }} />}
        </List>
      )}
    </>
  );
}
