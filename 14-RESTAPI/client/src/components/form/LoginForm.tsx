import { useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { motion, AnimatePresence, useAnimate, stagger } from 'motion/react';
import Input from './Input';
import Button from '../button/Button';
import css from './LoginForm.module.css';
import User from '@/models/User';

export default function LoginForm({ callback }: { callback: (user: User) => void}) {
  const { error, setError, reqHandler } = useFetch();
  const [isLogin, setIsLogin] = useState(true);
  const [ scope,    animate ] = useAnimate();
  const    label = isLogin ? 'Login' : 'Sign Up';
  const variants = {
     hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };
  const color = isLogin ? '#597326' : '';

  function switchForm() {
    setIsLogin(prev => !prev);
    setError(null);
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget); // data parsed by multer
    // const data = Object.fromEntries(formData.entries()); // if application/json
    const user = await reqHandler({
         url: isLogin ? 'login' : 'signup',
      method: 'POST',
        data,
    });

    if (user) {
      localStorage.setItem('jwt-access',  user.JWTaccess);
      localStorage.setItem('jwt-refresh', user.JWTrefresh);
      callback(user);
      setError(null);
    } else if (error) {
      animate(
        'p',
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.form
              key={isLogin + ''}
              ref={scope}
         onSubmit={submitHandler}
        className={`${css['login-form']} ${isLogin ? css['alternate'] : ''}`}
          initial='hidden'
          animate='visible'
             exit={{ opacity: 0, transition: { duration: 0.3}}}
       transition={{ staggerChildren: 0.2 }}
      >
        <motion.h2 variants={variants}>{label}</motion.h2>
        {!isLogin &&
          <motion.section variants={variants}>
            <Input id='name'     errors={error} />
            <Input id='surname'  errors={error} />
          </motion.section>
        }
        <Input     id='email'    errors={error} variants={variants} clr={color} />
        <Input     id='password' errors={error} variants={variants} clr={color} />
        {!isLogin &&
          <Input   id='password' errors={error} variants={variants} confirm />
        }
        <motion.button
               type='button'
          className={css['form-link']}
           variants={variants}
            onClick={switchForm}
        >
          {isLogin ? 'Switch to Sign Up' : 'Already have an account? Login'}
        </motion.button>
        <Button hsl={isLogin ? [80, 50, 30] : [180, 80, 35]} variants={variants}>
          {label}
        </Button>
      </motion.form>
    </AnimatePresence>
  );
}
