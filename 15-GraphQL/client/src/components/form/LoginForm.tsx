import { useState } from 'react';
import { motion, useAnimate, stagger } from 'motion/react';
import useDebounce from '@/hooks/useDebounce';
import { Auth } from '@/pages/RootLayout';
import Input from './Input';
import Button from '../button/Button';
import Loader from '../loading/Loader';
import css from './LoginForm.module.css';

export default function LoginForm({ isLoading, error, setError, reqUser }: Auth) {
  const { deferring,  deferFn } = useDebounce();
  const [isLogin,   setIsLogin] = useState(true);
  const [scope,        animate] = useAnimate();
  const    label = isLogin ? 'Login' : 'Sign Up';
  const variants = {
     hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };
  const color = isLogin ? '#597326' : '';

  function switchForm() {
    deferFn(() => {
      animate(scope.current, { opacity: [1, 0, 1] }, { duration: 1 });

      setTimeout(() => {
        setError(null);
        setIsLogin((prev) => !prev);
      }, 300);
    }, 1000);
  }

  const onSuccess = (user: Auth['user']) => {
    if (user) {
      const { JWTaccess, JWTrefresh } = user;
      setError(null);
      localStorage.setItem('jwt-access', JWTaccess);
      localStorage.setItem('jwt-refresh', JWTrefresh);
    }
  };

  const onError = () => {
    if (error && !error.message) {
      animate(
        'p',
        { x: [null, 10, 0, 10, 0] },
        { repeat: 1, duration: 0.3, delay: stagger(0.1) }
      );
    }
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    deferFn(async () => {
      const data = new FormData(e.currentTarget); // data parsed by multer
      // const data = Object.fromEntries(formData.entries()); // if application/json

      const graphqlData = {
        query: `
          mutation {
            signUp(userInput: {
                  name: "${data.get('name')}",
                 email: "${data.get('email')}",
              password: "${data.get('password')}"
            }) {
              JWTaccess
              JWTrefresh
              _id
              name
              email
            }
          }
        `
      };

      await reqUser(
        {
             url: 'graphql',
          method: 'POST',
            data: graphqlData,
        },
        { onSuccess, onError }
      );
    }, 1000);
  }

  return (
    <motion.form
             key={isLogin + ''}
             ref={scope}
        onSubmit={submitHandler}
       className={`${css['login-form']} ${isLogin ? css['isLogin'] : ''}`}
         initial='hidden'
         animate='visible'
            exit={{ opacity: 0, transition: { duration: 0.8 }}}
      transition={{ staggerChildren: 0.2 }}
    >
      <motion.h2 variants={variants}>{label}</motion.h2>
      {!isLogin &&
        <Input id='name'     errors={error} variants={variants} />
      }
      <Input   id='email'    errors={error} variants={variants} clr={color} />
      <Input   id='password' errors={error} variants={variants} clr={color} />
      {!isLogin &&
        <Input id='password' errors={error} variants={variants} confirm />
      }
      <motion.button
             type='button'
        className={css['form-link']}
         variants={variants}
          onClick={switchForm}
      >
        {isLogin ? 'Switch to Sign Up' : 'Already have an account? Login'}
      </motion.button>
      <Button
             hsl={isLogin ? [80, 50, 30] : [180, 80, 35]}
        variants={variants}
        disabled={deferring}
        whileTap={{ scale: deferring ? 1 : 0.9 }}
      >
        {isLoading ? <Loader size='small' /> : label}
      </Button>
    </motion.form>
  );
}
