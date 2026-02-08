import { Auth } from "@/lib/types/interface";
import UserProfile from "@/components/user/UserProfile";
import AuthForm from "@/components/form/forms/auth/AuthForm";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/landing/SplashScreen";
import { AnimatePresence } from "motion/react";

export default function AuthPage(props: Auth) {
  const { user, setUser, isLoading } = props;
  const [isInitial, setisInitial] = useState(true);

  useEffect(() => {
    if (!isLoading && isInitial) setisInitial(false);
  }, [isLoading, isInitial]);

  return (
    <AnimatePresence mode="wait">
      {isInitial || isLoading ? (
        <SplashScreen key="splash" />
      ) : user ? (
        <UserProfile key="profile" {...{ user, setUser }} />
      ) : (
        <AuthForm key="form" {...{ setUser }} />
      )}
    </AnimatePresence>
  );
}
