import { motion, AnimatePresence, Variants } from 'motion/react';
import { HTMLProps } from 'react';
import { FetchError } from '@/util/fetchData';
import ErrorPopUp from '../error/ErrorPopUp';
import css from './Input.module.css';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Input({
       id,
      clr = 'var(--team-green)',
     text,
   errors,
  confirm,
 variants,
  ...props
}: {
         id: string;
       clr?: string;
      text?: boolean;
     errors: FetchError | null;
   confirm?: boolean;
  variants?: Variants;
} & (HTMLProps<HTMLInputElement> & HTMLProps<HTMLTextAreaElement>)) {
  const     Element =    text ?         'textarea' : 'input';
  const        name = confirm ?   'confirm_' + id  : id;
  const       error =   errors?.[id];
  const       color =   error ? 'var(--error-red)' : clr;
  const borderColor =   color;
  let delay = 0.1 * (Object.keys(errors || {}).indexOf(id) + 1);
  if (confirm) delay += 0.1;

  return (
    <motion.div className={css['input']} variants={variants}>
      <label htmlFor={name} style={{ color }}>{name.replaceAll('_', ' ')}</label>
      <Element
           id={name}
         name={name}
        style={{ borderColor }}
        {...(id === 'password' && { type: 'password' })} // does not add Type to textarea
        {...props}
      />
      <AnimatePresence>
      {error && (
          <ErrorPopUp
            error={capitalize(id) + ' ' + error}
            delay={delay}
            style={{ bottom: '-1.3rem', left: '50%', translate: '-50%' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
