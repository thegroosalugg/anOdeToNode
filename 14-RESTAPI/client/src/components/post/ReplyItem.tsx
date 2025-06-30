import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '@/lib/hooks/useFetch';
import Reply from '@/models/Reply';
import ConfirmDialog from '../ui/modal/ConfirmDialog';
import ProfilePic from '../ui/image/ProfilePic';
import Button from '../ui/button/Button';
import { timeAgo } from '@/lib/util/timeStamps';

export default function ReplyItem({
  _id,
  creator,
  content,
  createdAt,
  userId,
}: Reply & { userId?: string }) {
  const [showModal, setShowModal] = useState(false);
  const { reqData } = useFetch();
  const    navigate    = useNavigate();
  const closeModal = () => setShowModal(false);

  const deleteReply = async () => {
    await reqData({ url: `post/delete-reply/${_id}`, method: 'DELETE' });
    closeModal();
  };

  return (
    <>
      <ConfirmDialog open={showModal} onCancel={closeModal} onConfirm={deleteReply} />
      <h2 onClick={() => navigate('/user/' + creator._id)}>
        <ProfilePic user={creator} />
        <span>
          {creator?.name    || 'Account'}
          {' '}
          {creator?.surname || 'deleted'}
        </span>
        <time>{timeAgo(createdAt)}</time>
      </h2>
      <p>{content}</p>
      {userId === creator._id && (
        <Button onClick={() => setShowModal(true)}>
          Delete
        </Button>
      )}
    </>
  );
}
