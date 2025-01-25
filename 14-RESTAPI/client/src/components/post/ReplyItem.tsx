import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import Reply from '@/models/Reply';
import Modal from '../modal/Modal';
import ConfirmDialog from '../dialog/ConfirmDialog';
import ProfilePic from '../profile/ProfilePic';
import Button from '../button/Button';
import { timeAgo } from '@/util/timeStamps';

export default function ReplyItem({
  _id,
  creator,
  content,
  updatedAt,
  userId,
}: Reply & { userId?: string }) {
  const [showModal, setShowModal] = useState(false);
  const { reqHandler } = useFetch();
  const    navigate    = useNavigate();
  const closeModal = () => setShowModal(false);

  const deleteReply = async () => {
    await reqHandler({ url: `post/delete-reply/${_id}`, method: 'DELETE' });
    closeModal();
  };

  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <ConfirmDialog onCancel={closeModal} onConfirm={deleteReply} />
      </Modal>
      <h2 onClick={() => navigate('/user/' + creator._id)}>
        <ProfilePic user={creator} />
        <span>
          {creator?.name    || 'Account'}
          {' '}
          {creator?.surname || 'deleted'}
        </span>
        <time>{timeAgo(updatedAt)}</time>
      </h2>
      <p>{content}</p>
      {userId === creator._id && (
        <Button hsl={[10, 54, 51]} onClick={() => setShowModal(true)}>
          Delete
        </Button>
      )}
    </>
  );
}
