import { useFetch } from '@/lib/hooks/useFetch';
import { useState } from 'react';
import { BASE_URL } from '@/lib/util/fetchData';
import { motion, useAnimate, stagger } from 'motion/react';
import { Authorized } from '@/lib/types/auth';
import { FetchError } from '@/lib/types/common';
import ImagePicker from '../form/ImagePicker';
import Modal from '../ui/modal/Modal';
import Button from '../ui/button/Button';
import ErrorPopUp from '../ui/boundary/error/ErrorPopUp';
import UserInfo from './UserInfo';
import { formatDate } from '@/lib/util/timeStamps';
import css from './ProfileHeader.module.css';

export default function ProfileHeader({ user, setUser }: Pick<Authorized, 'user' | 'setUser'>) {
  const { name, surname, imgURL, createdAt } = user;
  const [showModal,            setShowModal] = useState(false);
  const [displayPic,          setDisplayPic] = useState(imgURL);
  const [scope,                     animate] = useAnimate();
  const { reqData,     error,     setError } = useFetch<{ imgURL: string}>();

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const onError = (err: FetchError) => {
      // checks state to prevent animation running on initial submit
      if (error) {
        animate(
          'p',
          { x: [null, 10, 0, 10, 0] },
          { repeat: 1, duration: 0.3, delay: stagger(0.1) }
        );
      }
      // checks immediate value from catch block to logout
      if (err.status === 401) {
        setTimeout(() => {
          setUser(null);
        }, 2000);
      }
    };

    const onSuccess = ({ imgURL }: { imgURL: string }) => {
      setDisplayPic(imgURL);
      setError(null);
      setShowModal(false);
    };

    await reqData(
      { url: 'profile/set-pic', method: 'POST', data },
      { onError, onSuccess }
    );
  }

  function closeModal() {
    setShowModal(false);
    setError(null);
  }

  return (
    <>
      <Modal open={showModal} close={closeModal}>
        <form className={css['upload-image']} onSubmit={submitHandler} ref={scope}>
          <h2>Select a Profile Picture</h2>
          <ImagePicker imgURL={displayPic} />
          <Button>Submit</Button>
          {error && (
            <ErrorPopUp
              error={error.message}
              style={{ bottom: '0.75rem', left: '1.5rem' }}
            />
          )}
        </form>
      </Modal>
      <motion.header
         className={css['profile-header']}
           initial={{   opacity: 0  }}
           animate={{   opacity: 1  }}
              exit={{   opacity: 0  }}
        transition={{ duration: 0.5 }}
      >
        <h1>
          <span>
            {name} {surname}
          </span>
          <span>Joined on {formatDate(createdAt, ['year'])}</span>
        </h1>
        <section>
          <div className={css['user-photo']} onClick={() => setShowModal(true)}>
            {displayPic ? (
              <motion.img
                    key={displayPic}
                    src={BASE_URL + displayPic}
                    alt={name}
                animate={{ opacity: [0, 1] }}
                onError={(e) => ((e.target as HTMLImageElement).src = '/notFound.png')}
              />
            ) : (
              <p>Upload an image</p>
            )}
          </div>
          <UserInfo {...{ user }} />
        </section>
      </motion.header>
    </>
  );
}
