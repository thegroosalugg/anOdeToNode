import Msg from '@/models/Msg';
import Textarea from '../form/Textarea';
import { useState } from 'react';
import { SetData, useFetch } from '@/hooks/useFetch';
import Button from '../button/Button';

export default function MsgItem({
      msg: { _id, text },
  setData,
}: {
      msg: Msg;
  setData: SetData<Msg[]>;
}) {
  const { reqHandler } = useFetch<Msg[]>();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing(!isEditing);

  async function deleteMsg(msgId: string) {
    await reqHandler(
      { url: `delete/${msgId}`, method: 'DELETE' },
      { onSuccess: () => setData((prev) => prev.filter(({ _id }) => _id !== msgId)) }
    );
  }

  return (
    <li style={{ display: 'flex', alignItems: 'end', gap: 2.5 }}>
      {isEditing ? (
        <Textarea<Msg> {...{ url: `edit/${_id}`, setData, text, cb: toggleEditing }} />
      ) : (
        <p style={{ minWidth: 0, marginRight: 'auto' }}>{text}</p>
      )}
      <Button onClick={toggleEditing}>
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
      {!isEditing && (
        <Button styled onClick={() => deleteMsg(_id)}>
          Delete
        </Button>
      )}
    </li>
  );
}
