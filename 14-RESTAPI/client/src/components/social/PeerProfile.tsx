import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';
import { useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { PEER_CONFIG } from './peerProfileConfig';
import { Auth } from '@/pages/RootLayout';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';
import Modal from '../modal/Modal';
import ConfirmDialog from '../dialog/ConfirmDialog';
import ProfilePic from '../profile/ProfilePic';
import Button, { HSL } from '../button/Button';
import Loader from '../loading/Loader';
import { captainsLog } from '@/util/captainsLog';
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
  const {   _id, name, surname  } = peer;

  const  connection = user.friends.find((friend) => friend.user === _id);
  const    isFriend = connection?.status === 'accepted';
  const isRequested = connection?.status === 'received';
  const       color = connection ?     '#ffffff' : 'var(--team-green)';
  const borderColor = connection ? 'transparent' : 'var(--team-green)';
  const { text, icon, hsl, action } = PEER_CONFIG[connection?.status || 'none'];

  const closeModal = () => setShowModal(false);

  const friendRequest = async (reqAction = action) => {
    if (!reqAction) return; // action = undefined if isFriend
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
  }

  async function handleAction() {
    if (!isFriend) {
      await friendRequest();
    } else {
      captainsLog(150, -90, ['MESSAGE FUNCTION']);
    }
  }

  async function deleteFriend() {
    if (isFriend) {
      setShowModal(true);
    } else if (isRequested) {
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
                 hsl={hsl as HSL}
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
          {(isRequested || isFriend) && (
            <Button hsl={[10, 54, 51]} onClick={deleteFriend}>
              {isRequested ? (
                <span>
                  Decline <FontAwesomeIcon icon='rectangle-xmark' size='xs' />
                </span>
              ) : (
                'Remove Friend'
              )}
            </Button>
          )}
        </div>
      </motion.section>
    </>
  );
}
