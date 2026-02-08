import { useState } from "react";
import { motion } from "motion/react";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDefer } from "@/lib/hooks/useDefer";
import { useAnimations } from "@/lib/hooks/useAnimations";
import { api } from "@/lib/http/endpoints";
import { SetUser } from "@/lib/types/interface";
import User from "@/models/User";
import Input from "../../primitives/Input";
import Button from "@/components/ui/button/Button";
import Loader from "@/components/ui/boundary/loader/Loader";
import { createVariants } from "@/lib/motion/animations";
import { saveTokens } from "@/lib/http/token";
import css from "./AuthForm.module.css";

export default function AuthForm({ setUser }: { setUser: SetUser }) {
  const { deferring,      defer } = useDefer();
  const [isLogin,     setIsLogin] = useState(true);
  const { scope, animate, shake } = useAnimations();
  const { isLoading, error, setError, reqData } = useFetch<User>(); // reqUser is avail from props, but a 2nd isLoading state is needed
  const label = isLogin ? "Login" : "Sign Up";
  const variants = createVariants({ transition: { duration: 0.2 } });

  function switchForm() {
    defer(() => {
      animate(scope.current, { opacity: [1, 0, 1] }, { duration: 1 });
      setTimeout(() => {
        setError(null);
        setIsLogin((prev) => !prev);
      }, 300);
    }, 1000);
  }

  const onSuccess = (user: User) => {
    saveTokens(user);
    setUser(user);
    setError(null);
  };

  const onError = () => {
    if (error && !error.message && scope.current) shake("p");
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    defer(async () => {
      const data = new FormData(e.currentTarget); // data parsed by multer
      // const data = Object.fromEntries(formData.entries()); // if application/json
      await reqData({
              url: isLogin ? api.user.login : api.user.signup,
           method: "POST",
             data,
        onSuccess,
          onError,
      });
    }, 1000);
  }

  return (
    <motion.form
             key={isLogin + ""}
             ref={scope}
        onSubmit={submitHandler}
       className={`${css["auth-form"]} ${isLogin ? css["is-login"] : ""}`}
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
          <Input control="name"     errors={error}>Name</Input>
          <Input control="surname"  errors={error}>Surname</Input>
        </motion.section>
      )}
      <Input     control="email"    errors={error} {...{ variants }}>Email</Input>
      <Input     control="password" errors={error} {...{ variants }}>Password</Input>
      {!isLogin &&
        <Input   control="password" errors={error} {...{ variants }} confirm>
          Confirm Password
        </Input>
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
        {isLoading ? <Loader size="xs" color="page" /> : label}
      </Button>
    </motion.form>
  );
}
