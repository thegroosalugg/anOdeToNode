import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { getPeerConfig } from './peerProfileConfig';
import { Auth } from '@/pages/RootLayout';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';
import Modal from '../modal/Modal';
import ConfirmDialog from '../dialog/ConfirmDialog';
import ProfilePic from '../profile/ProfilePic';
import Button from '../button/Button';
import Loader from '../loading/Loader';
import { formatDate } from '@/util/timeStamps';
import css from './PeerProfile.module.css';

const prefixes = ['Lives in',  'Works at', 'Studied at', ''            ];
const    icons = [   'house', 'briefcase',       'book', 'comment-dots'] as const;

const InfoTag = ({ text, i }: { text?: string, i: number }) => {
  if (!text) return null;
  return (
    text && (
      <p className={css['info-tag']}>
        <FontAwesomeIcon icon={icons[i]} />
        {' '}{prefixes[i]} {text}
      </p>
    )
  );
};

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
  const { _id, name, surname, createdAt, about } = peer;
  const {    bio,    home,    study,    work   } = about ?? {};

  const  connection = user.friends.find((friend) => friend.user._id === _id);
  const { accepted, initiated, acceptedAt } = connection ?? {};
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
      navigate('/inbox/' + peer._id);
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
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
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
              <Loader size='small' />
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
        <div className={css['user-info']}>
          <h2>Joined on {formatDate(createdAt, ['year'])}</h2>
          {acceptedAt && (
            <h2>You have been friends since {formatDate(acceptedAt, ['year'])}</h2>
          )}
          <InfoTag {...{ text: home,  i: 0 }} />
          <InfoTag {...{ text: work,  i: 1 }} />
          <InfoTag {...{ text: study, i: 2 }} />
          <InfoTag {...{ text: bio,   i: 3 }} />
        </div>
      </motion.section>
    </>
  );
}
