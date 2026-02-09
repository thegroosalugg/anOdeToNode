import { Auth } from "@/lib/types/interface";
import UserProfile from "@/components/user/UserProfile";
import AuthForm from "@/components/form/forms/auth/AuthForm";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/landing/SplashScreen";
import AuthHero from "@/components/landing/AuthHero";
import { AnimatePresence } from "motion/react";

let hasInitialised = false; // survives route changes, ensures splash plays only on first render

export default function AuthPage(props: Auth) {
  const { user, setUser, isLoading } = props;
  const [isInitial, setisInitial] = useState(!hasInitialised); // init = true, re-render = false

  useEffect(() => {
    if (!isLoading && isInitial) {
      setisInitial(false);
      hasInitialised = true;
    }
  }, [isLoading, isInitial]);

  return (
    <AnimatePresence mode="wait">
      {isInitial || isLoading ? (
        <SplashScreen key="splash" />
      ) : user ? (
        <UserProfile key="profile" {...{ user, setUser }} />
      ) : (
        <AuthHero key="auth">
          <AuthForm {...{ setUser }} />
        </AuthHero>
      )}
    </AnimatePresence>
  );
}
