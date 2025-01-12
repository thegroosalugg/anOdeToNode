import useFetch, { FetchError } from '@/hooks/useFetch';
import { useState } from 'react';
import { BASE_URL } from '@/util/fetchData';
import { motion, useAnimate, stagger } from 'motion/react';
import { AuthProps } from '@/pages/RootLayout';
import ImagePicker from '../form/ImagePicker';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import ErrorPopUp from '../error/ErrorPopUp';
import css from './About.module.css';
export default function About({
   user,
  on401,
}: {
   user: AuthProps['user'];
  on401: (err: FetchError) => void;
}) {
  const { name,    surname,    imgURL } = user || {};
  const [ showModal,     setShowModal ] = useState(false);
  const [ displayPic,   setDisplayPic ] = useState(imgURL);
  const [ scope,              animate ] = useAnimate();
  const { reqHandler, error, setError } = useFetch<{ imgURL: string} | null>();

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res  = await reqHandler({ url: 'profile/pic', method: 'POST', data }, on401);
    if (res) {
      setDisplayPic(res.imgURL);
      setError(null);
      setShowModal(false);
    } else if (error) {
      animate(
        'p',
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
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
         className={css['about']}
           initial={{   opacity: 0  }}
           animate={{   opacity: 1  }}
              exit={{   opacity: 0  }}
        transition={{ duration: 0.5 }}
      >
        <h1>
          {name} {surname}
        </h1>
        <div onClick={() => setShowModal(true)}>
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
      </motion.section>
    </>
  );
}
