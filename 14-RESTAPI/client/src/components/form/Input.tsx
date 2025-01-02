import { HTMLProps } from 'react';
import css from './Input.module.css';

export default function Input({
       id,
     text,
  ...props
}: {
     id: string;
  text?: boolean;
} & (HTMLProps<HTMLInputElement> & HTMLProps<HTMLTextAreaElement>)) {
  const Element = text ? 'textarea' : 'input';

  return (
    <div className={css.input}>
      <label htmlFor={id}>{id}</label>
      <Element id={id} name={id} {...props} />
    </div>
  );
}
