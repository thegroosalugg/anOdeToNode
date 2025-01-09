import { useState } from 'react';
import User from '@/models/User';
import About from './About';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import ConfirmDialog from '../dialog/ConfirmDialog';
import css from './UserProfile.module.css';

export default function UserProfile({ user, logout }: { user: User; logout: () => void }) {
  const [showModal, setShowModal] = useState(false);

  function closeModal() {
    setShowModal(false);
  }

  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <ConfirmDialog onConfirm={logout} onCancel={closeModal} />
      </Modal>
      <section className={css['user-profile']}>
        <About user={user} />
        <Button hsl={[10, 54, 51]} onClick={() => setShowModal(true)}>
          Logout
        </Button>
      </section>
    </>
  );
}
