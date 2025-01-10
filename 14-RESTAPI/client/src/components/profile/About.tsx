import useFetch from '@/hooks/useFetch';
import { useState } from 'react';
import { BASE_URL } from '@/util/fetchData';
import { motion } from 'motion/react';
import User from '@/models/User';
import ImagePicker from '../form/ImagePicker';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import css from './About.module.css';

export default function About({ user }: { user: User }) {
  const { name,  surname,  imgURL } = user;
  const [showModal,   setShowModal] = useState(false);
  const [displayPic, setDisplayPic] = useState(imgURL);
  const {       reqHandler        } = useFetch();

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res  = await reqHandler({ url: 'profile/pic', method: 'POST', data });
    if (res.imgURL) {
      setDisplayPic(res.imgURL);
    } else if (res.message) {
      //
    }
    setShowModal(false);
  }

  return (
    <>
      <Modal show={showModal} close={() => setShowModal(false)}>
        <form className={css['upload-image']} onSubmit={submitHandler}>
          <h2>Select a Profile Picture</h2>
          <ImagePicker imgURL={displayPic} />
          <Button hsl={[197, 71, 53]}>Submit</Button>
        </form>
      </Modal>
      <section className={css['about']}>
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
      </section>
    </>
  );
}
