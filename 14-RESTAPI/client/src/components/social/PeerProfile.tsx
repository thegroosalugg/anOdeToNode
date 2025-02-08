import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { getPeerConfig } from './peerProfileConfig';
import { Auth } from '@/pages/RootLayout';
import useFetch from '@/hooks/useFetch';
import User, { getId } from '@/models/User';
import Modal from '../modal/Modal';
import ConfirmDialog from '../dialog/ConfirmDialog';
import ProfilePic from '../profile/ProfilePic';
import Button from '../button/Button';
import Loader from '../loading/Loader';
import css from './PeerProfile.module.css';

export default function PeerProfile({
     user,
  setUser,
     peer,
}: {
     user: User;
  setUser: Auth['setUser'];
     peer: User;
}) {
  const { isLoading, reqHandler } = useFetch();
  const { deferring,    deferFn } = useDebounce();
  const [showModal, setShowModal] = useState(false);
  const         navigate          = useNavigate();
  const {   _id, name, surname  } = peer;

  const  connection = user.friends.find((friend) => getId(friend.user) === _id);
  const { accepted, initiated } = connection ?? {};
  const       color = connection ?     '#ffffff' : 'var(--team-green)';
  const borderColor = connection ? 'transparent' : 'var(--team-green)';
  const { text, icon, hsl, action } = getPeerConfig(connection);
  const closeModal = () => setShowModal(false);

  const friendRequest = async (reqAction = action) => {
    if (!reqAction) return; // action = undefined if connection accepted
    // in this case an argument must be passed
    deferFn(async () => {
      await reqHandler(
        { url: `social/${_id}/${reqAction}`, method: 'POST' },
        {
          onError: (err) => {
            if (err.status === 401) setUser(null);
          },
        }
      );
    }, 1000);
  };

  async function handleAction() {
    if (!accepted) {
      await friendRequest();
    } else {
      await reqHandler(
        { url: `chat/new/${peer._id}`, method: 'POST' },
        {
          onSuccess: () => navigate('/inbox'),
        }
      );
    }
  }

  async function deleteFriend() {
    if (accepted) {
      setShowModal(true);
    } else if (connection && !initiated) {
      await friendRequest('delete');
    }
  }

  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <ConfirmDialog
          onConfirm={async () => {
            await friendRequest('delete');
            closeModal();
          }}
          onCancel={closeModal}
        />
      </Modal>
      <motion.section
        className={css['peer-profile']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.5 } }}
      >
        <div className={css['profile-pic']}>
          <div>
            <ProfilePic user={peer} />
            <h2>
              {name} {surname}
            </h2>
          </div>
          <Button
                 hsl={hsl}
             onClick={handleAction}
               style={{ color, borderColor }}
            disabled={deferring}
          >
            {isLoading ? (
              <Loader small />
            ) : (
              <span>
                {text}
                <FontAwesomeIcon icon={icon} size='xs' />
              </span>
            )}
          </Button>
          {(accepted || (connection && !initiated)) && (
            <Button hsl={[10, 54, 51]} onClick={deleteFriend}>
              {accepted ? (
                  'Remove Friend'
              ) : (
                <span>
                  Decline <FontAwesomeIcon icon='rectangle-xmark' size='xs' />
                </span>
              )}
            </Button>
          )}
        </div>
      </motion.section>
    </>
  );
}
