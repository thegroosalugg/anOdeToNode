import { motion, AnimatePresence, Variants } from 'motion/react';
import { HTMLProps } from 'react';
import { FetchError } from '@/hooks/useFetch';
import css from './Input.module.css';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Input({
       id,
     text,
   errors,
 variants,
  ...props
}: {
         id: string;
      text?: boolean;
     errors: FetchError | null;
  variants?: Variants;
} & (HTMLProps<HTMLInputElement> & HTMLProps<HTMLTextAreaElement>)) {
  const     Element = text ? 'textarea' : 'input';
  const       error = (errors || {})[id as keyof typeof errors];
  const       delay = 0.1 * (Object.keys(errors || {}).indexOf(id) + 1);
  const       color = error ? 'var(--error-red)' : 'var(--team-green)';
  const borderColor = color;

  return (
    <motion.div className={css['input']} variants={variants}>
      <label htmlFor={id}        style={{ color }}>{id.replaceAll('_', ' ')}</label>
      <Element id={id} name={id} style={{ borderColor }} {...props} />
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
