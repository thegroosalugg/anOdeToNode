import { useState } from 'react';
import css from './ImagePicker.module.css';

export default function ImagePicker() {
  const [image, setImage] = useState('');
  const style = image ? { background: '#252525' } : {};

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImage(URL.createObjectURL(files[0]));
    } else {
      setImage('');
    }
  };

  return (
    <label className={css['picker']} htmlFor='image' style={style} >
      <input type='file' id='image' name='image' accept='image/*' onChange={changeHandler} />
      {image ? <img src={image} alt='preview' /> : <span>Choose an Image</span>}
    </label>
  );
}
