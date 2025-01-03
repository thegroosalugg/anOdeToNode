import { useState } from 'react';
import css from './ImagePicker.module.css';

export default function ImagePicker() {
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const    imgColor = image ? {  background: '#252525' } : {};
  const borderColor = error ? { borderColor: '#c65740' } : {};
  const  errorColor = error ? {       color: '#c65740' } : {};

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (['image/png', 'image/jpg', 'image/jpeg'].includes(files[0].type)) {
        setImage(URL.createObjectURL(files[0]));
        setError('');
      } else {
        setImage('');
        setError('Invalid file type');
      }
    } else {
      setImage('');
      setError('');
    }
  };

  return (
    <label
      className={css['picker']}
        htmlFor='image'
          style={{ ...imgColor, ...borderColor }}
    >
      <input
        onChange={changeHandler}
          accept='image/*'
            type='file'
              id='image'
            name='image'
      />
      {image ? (
        <img src={image} alt='preview' />
      ) : (
        <span style={errorColor}>{error ? error : 'Choose an Image'}</span>
      )}
    </label>
  );
}
