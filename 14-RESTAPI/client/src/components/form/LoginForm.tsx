import { useState } from 'react';
import { FetchError } from '@/hooks/useFetch';
import { motion, AnimatePresence } from 'motion/react';
import Input from './Input';
import Button from '../button/Button';
import css from './LoginForm.module.css';

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const label = isLogin ? 'Login' : 'Sign Up';
  const variants = {
    hidden: { opacity: 0 },
   visible: { opacity: 1, transition: { duration: 0.5 } },
 };

  return (
    <AnimatePresence mode='wait'>
      <motion.form
              key={isLogin + ''}
        className={`${css['login-form']} ${isLogin ? css['alternate'] : ''}`}
          initial='hidden'
          animate='visible'
             exit={{ opacity: 0, transition: { duration: 0.5 }}}
       transition={{ staggerChildren: 0.3 }}
      >
        <motion.h2 variants={variants}>{label}</motion.h2>
        {!isLogin &&
          <motion.section variants={variants}>
            <Input id='name'           errors={{} as FetchError} />
            <Input id='surname'        errors={{} as FetchError} />
          </motion.section>
        }
        <Input id='email'              errors={{} as FetchError} variants={variants} />
        <Input id='password'           errors={{} as FetchError} variants={variants} />
        {!isLogin &&
          <Input id='confirm_password' errors={{} as FetchError} variants={variants} />
        }
        <motion.button
               type='button'
          className={css['form-link']}
           variants={variants}
            onClick={() => setIsLogin(state => !state)}>
          {isLogin ? 'Switch to Sign Up' : 'Already have an account? Login'}
        </motion.button>
        <Button hsl={isLogin ? [80, 50, 30] : [180, 80, 35]} variants={variants}>
          {label}
        </Button>
      </motion.form>
    </AnimatePresence>
  );
}
