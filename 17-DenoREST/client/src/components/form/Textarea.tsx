import { SetData, useFetch } from '@/hooks/useFetch';
import { URL } from '@/util/fetchData';
import { useRef } from 'react';
import Button from '../button/Button';

export default function Textarea<T>({
       url,
   setData,
        cb,
  children = '',
}: {
        url: Extract<URL, 'new' | `edit/${string}`>;
        cb?: () => void;
    setData: SetData<T>;
  children?: string;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { reqHandler } = useFetch<T>();
  const key = url.split('/')[0];
  const method = ({ new: 'POST', edit: 'PUT' } as const)[key];

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = form.get('text');
    await reqHandler(
      { url, method, data: { text } },
      {
        onSuccess: (data) => {
          setData(data);
          if (cb) cb();
          formRef.current?.reset();
        },
      }
    );
  }

  return (
    <form
         style={{ display: 'flex', alignItems: 'end', gap: 5, width: '100%', minWidth: 0 }}
           ref={formRef}
      onSubmit={submitHandler}
    >
      <textarea name='text' rows={3} style={{ resize: 'none', flex: 1 }}>
        {children}
      </textarea>
      <Button styled>Send</Button>
    </form>
  );
}
