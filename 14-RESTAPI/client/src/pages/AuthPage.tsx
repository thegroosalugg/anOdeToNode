import { UserNullState } from "@/lib/types/interface";
import UserProfile from "@/components/user/UserProfile";
import AuthForm from "@/components/form/forms/auth/AuthForm";
import AuthHero from "@/components/landing/AuthHero";
import { AnimatePresence } from "motion/react";

export default function AuthPage({ user, setUser }: UserNullState) {
  return (
    <AnimatePresence mode="wait">
      {user ? (
        <UserProfile key="profile" {...{ user, setUser }} />
      ) : (
        <AuthHero key="auth">
          <AuthForm {...{ setUser }} />
        </AuthHero>
      )}
    </AnimatePresence>
  );
}
