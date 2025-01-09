import { useState } from 'react';
import { BASE_URL } from '@/util/fetchData';
import User from '@/models/User';
import ImagePicker from '../form/ImagePicker';
import Modal from '../modal/Modal';
import Button from '../button/Button';
import css from './About.module.css';

export default function About({ user }: { user: User }) {
  const { name, surname, imgURL } = user;
  const [showModal, setShowModal] = useState(false);

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
  }

  return (
    <>
      <Modal show={showModal} close={() => setShowModal(false)}>
        <form className={css['upload-image']} onSubmit={submitHandler}>
          <h2>Select a Profile Picture</h2>
          <ImagePicker />
          <Button hsl={[197, 71, 53]}>Submit</Button>
        </form>
      </Modal>
      <section className={css['about']}>
        <h1>
          {name} {surname}
        </h1>
        <div onClick={() => setShowModal(true)}>
          {imgURL ? <img src={BASE_URL + imgURL} alt={name} /> : <p>Upload an image</p>}
        </div>
      </section>
    </>
  );
}
