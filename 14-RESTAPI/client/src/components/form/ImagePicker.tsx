import { useState } from 'react';
import { BASE_URL } from '@/util/fetchData';
import css from './ImagePicker.module.css';

export default function ImagePicker({
  imgURL,
  ...props
}: {
  imgURL?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>) {
  const initialImg = imgURL ? BASE_URL + imgURL : '';
  const [image, setImage] = useState(initialImg);
  const [error, setError] = useState('');
  const  background = image ?      '#252525' : '#ffffff00';
  const       color = error ? 'var(--error)' : 'var(--accent)';
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
        <img
            src={image}
            alt='preview'
        onError={(e) => ((e.target as HTMLImageElement).src = '/notFound.png')}
      />
      ) : (
        <span style={{ color }}>{error ? error : 'Choose an Image'}</span>
      )}
    </label>
  );
}
