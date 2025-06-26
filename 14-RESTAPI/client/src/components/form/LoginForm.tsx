import { useState } from "react";
import { motion, useAnimate, stagger } from "motion/react";
import useDebounce from "@/hooks/useDebounce";
import { Auth } from "@/pages/RootLayout";
import Input from "./Input";
import Button from "../button/Button";
import Loader from "../loading/Loader";
import css from "./LoginForm.module.css";

export default function LoginForm({ isLoading, error, setError, reqUser }: Auth) {
  const { deferring, deferFn } = useDebounce();
  const [isLogin,  setIsLogin] = useState(true);
  const [scope,       animate] = useAnimate();
  const label = isLogin ? "Login" : "Sign Up";
  const variants = {
     hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  function switchForm() {
    deferFn(() => {
      animate(scope.current, { opacity: [1, 0, 1] }, { duration: 1 });

      setTimeout(() => {
        setError(null);
        setIsLogin((prev) => !prev);
      }, 300);
    }, 1000);
  }

  const onSuccess = (user: Auth["user"]) => {
    if (user) {
      const { JWTaccess, JWTrefresh } = user;
      setError(null);
      localStorage.setItem("jwt-access", JWTaccess);
      localStorage.setItem("jwt-refresh", JWTrefresh);
    }
  };

  const onError = () => {
    if (error && !error.message) {
      animate(
        "p",
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
      await reqUser(
        {
             url: isLogin ? "login" : "signup",
          method: "POST",
            data,
        },
        { onSuccess, onError }
      );
    }, 1000);
  }

  return (
    <motion.form
             key={isLogin + ""}
             ref={scope}
        onSubmit={submitHandler}
       className={`${css["login-form"]} ${isLogin ? css["isLogin"] : ""}`}
         initial="hidden"
         animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ staggerChildren: 0.2 }}
    >
      <motion.h2 className="truncate" {...{ variants }}>
        {label}
      </motion.h2>
      {!isLogin && (
        <motion.section {...{ variants }}>
          <Input id="name"     errors={error} />
          <Input id="surname"  errors={error} />
        </motion.section>
      )}
      <Input     id="email"    errors={error} {...{ variants }} />
      <Input     id="password" errors={error} {...{ variants }} />
      {!isLogin &&
        <Input   id="password" errors={error} {...{ variants }} confirm />
      }
      <motion.button
        {...{ variants }}
             type="button"
        className={css["form-link"]}
          onClick={switchForm}
      >
        {isLogin ? "Switch to Sign Up" : "Already have an account? Login"}
      </motion.button>
      <Button
        {...{ variants }}
        disabled={deferring}
        whileTap={{ scale: deferring ? 1 : 0.9 }}
      >
        {isLoading ? <Loader size="small" /> : label}
      </Button>
    </motion.form>
  );
}
