import List from '@/components/list/List';
import { useFetch } from '@/hooks/useFetch';
import Msg from '@/models/Msg';
import { useEffect, useRef } from 'react';

export default function Messages() {
  const { data, setData, isLoading, reqHandler } = useFetch<Msg[]>([]);
  const { reqHandler: reqMsg } = useFetch<Msg>();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const getMsgs = async () => reqHandler({ url: 'msgs' });
    getMsgs();
  }, [reqHandler]);

  async function newMsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = form.get('text');
    await reqMsg(
      { url: 'new', method: 'POST', data: { text } },
      {
        onSuccess: (msg) => {
          setData((prev) => [msg, ...prev]);
          formRef.current?.reset();
        },
      }
    );
  }

  async function deleteMsg(msgId: string) {
    await reqMsg(
      { url: 'delete/' + msgId, method: 'DELETE' },
      { onSuccess: (data) => setData(data as unknown as Msg[]) }
    );
  }

  const    display = 'flex';
  const      color = 'white';
  const background = 'var(--party-purple)';
  const    padding = '0 0.5rem';

  return (
    <>
      <form
             ref={formRef}
        onSubmit={newMsg}
           style={{ display, alignItems: 'stretch', gap: 5, marginBottom: 10 }}
      >
        <textarea name='text' rows={3} style={{ resize: 'none', width: 300 }} />
        <button style={{ color, background, padding }}>
          Send
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List items={data}>
          {({ _id, text }) => (
            <li key={_id} style={{ display, alignItems: 'center' }}>
              <p style={{ minWidth: 0 }}>{text}</p>
              <button style={{ marginLeft: 'auto', padding }}>Edit</button>
              <button onClick={() => deleteMsg(_id)} style={{ color, background, padding }}>
                Del
              </button>
            </li>
          )}
        </List>
      )}
    </>
  );
}
