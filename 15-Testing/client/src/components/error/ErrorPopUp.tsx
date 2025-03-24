import { motion, HTMLMotionProps } from 'framer-motion';
import css from './ErrorPopUp.module.css';

interface ErrorPopUpProps extends HTMLMotionProps<'p'> {
   error: string;
  delay?: number;
}

const ErrorPopUp: React.FC<ErrorPopUpProps> = ({ error, delay, ...props }) => {
  return (
    <motion.p
      className={css['error-pop-up']}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { delay } }}
           exit={{ opacity: 0, scale: 0.5 }}
        {...props}
    >
      {error}
    </motion.p>
  );
};

export default ErrorPopUp;
