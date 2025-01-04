import { useState } from 'react';
import css from './ImagePicker.module.css';

export default function ImagePicker({...props}) {
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const  background = image ?          '#252525' : '#ffffff00';
  const       color = error ? 'var(--error-red)' : 'var(--team-green)';
  const borderColor = color;
  const { style, ...labelProps } = props;

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
          style={{ background, borderColor, ...style }}
      {...labelProps}
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
        <span style={{ color }}>{error ? error : 'Choose an Image'}</span>
      )}
    </label>
  );
}
