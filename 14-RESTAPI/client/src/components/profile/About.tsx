import useFetch from '@/hooks/useFetch';
import { useState } from 'react';
import { BASE_URL, FetchError } from '@/util/fetchData';
import { motion, useAnimate, stagger } from 'motion/react';
import { Authorized } from '@/pages/RootLayout';
import ImagePicker from '../form/ImagePicker';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import ErrorPopUp from '../error/ErrorPopUp';
import { formatDate } from '@/util/timeStamps';
import css from './About.module.css';

export default function About({ user, setUser }: Pick<Authorized, 'user' | 'setUser'>) {
  const { name, surname, imgURL, createdAt } = user;
  const [ showModal,     setShowModal ] = useState(false);
  const [ displayPic,   setDisplayPic ] = useState(imgURL);
  const [ scope,              animate ] = useAnimate();
  const { reqHandler, error, setError } = useFetch<{ imgURL: string}>();

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

    await reqHandler(
      { url: 'profile/pic', method: 'POST', data },
      { onError, onSuccess }
    );
  }

  function closeModal() {
    setShowModal(false);
    setError(null);
  }

  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <form className={css['upload-image']} onSubmit={submitHandler} ref={scope}>
          <h2>Select a Profile Picture</h2>
          <ImagePicker imgURL={displayPic} />
          <Button hsl={[197, 71, 53]}>Submit</Button>
          {error && (
            <ErrorPopUp
              error={error.message}
              style={{ bottom: '0.75rem', left: '1.5rem' }}
            />
          )}
        </form>
      </Modal>
      <motion.section
         className={css['profile']}
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
        </section>
      </motion.section>
    </>
  );
}
