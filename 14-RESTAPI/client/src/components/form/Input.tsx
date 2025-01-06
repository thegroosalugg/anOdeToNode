import { motion, AnimatePresence, Variants } from 'motion/react';
import { HTMLProps } from 'react';
import { FetchError } from '@/hooks/useFetch';
import css from './Input.module.css';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Input({
       id,
     text,
   errors,
  confirm,
 variants,
  ...props
}: {
         id: string;
      text?: boolean;
     errors: FetchError | null;
   confirm?: boolean;
  variants?: Variants;
} & (HTMLProps<HTMLInputElement> & HTMLProps<HTMLTextAreaElement>)) {
  const     Element =    text ?         'textarea' : 'input';
  const        name = confirm ?   'confirm_' + id  : id;
  const       error =   errors?.[id];
  const       color =   error ? 'var(--error-red)' : 'var(--team-green)';
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
          <motion.p
            className={css['error']}
                style={{ translate: '-50%' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale:   1, transition: { delay } }}
                 exit={{ opacity: 0, scale: 0.5 }}
          >
            {capitalize(id) + ' ' + error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
