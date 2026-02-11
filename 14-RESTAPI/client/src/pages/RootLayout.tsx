import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Meta from "@/components/meta/Meta";
import SplashScreen from "@/components/landing/SplashScreen";
import FlashTransition from "@/components/ui/transition/FlashTransition";
import NavBar from "@/components/layout/header/NavBar";
import Footer from "@/components/layout/footer/Footer";
import { useFetch } from "@/lib/hooks/useFetch";
import { api } from "@/lib/http/endpoints";
import { eventBus } from "@/lib/util/eventBus";
import { useTheme } from "@/lib/hooks/useTheme";
import { saveTokens } from "@/lib/http/token";
import { postAnalytics } from "@/lib/http/analytics";
import User from "@/models/User";
import { UserNullState } from "@/lib/types/interface";
import { getStaticMetadata } from "@/lib/meta/meta";

export default function RootLayout({ children }: { children: (props: UserNullState) => ReactNode }) {
  const { pathname } = useLocation();
  const { data: user, setData: setUser, reqData, isInitial } = useFetch<User>();
  const { title, description } = getStaticMetadata(pathname, user);
  const [offset,    setOffset] = useState({ width: 0, height: 0 });
  useTheme();

  useEffect(() => {
    reqData({
            url: api.user.refresh({ populate: true }),
         method: "POST",
      onSuccess: (user) => saveTokens(user),
    });

    postAnalytics();
    const logout = eventBus.on("logout", () => setUser(null));
    return logout(); // clean-up - called on dismount
  }, [reqData, setUser]);

  if (isInitial) return <SplashScreen />;

  const isLandscapeMobile = window.matchMedia(
    "(pointer: coarse) and (orientation: landscape)",
  ).matches;

  return (
    <>
      <Meta {...{ description }}>{title}</Meta>
      <FlashTransition trigger={pathname} />
      <NavBar {...{ user, setUser, offset, setOffset }} />
      <main id="main" style={{ marginLeft: isLandscapeMobile ? offset.width : 0 }}>
        {children({ user, setUser })}
      </main>
      <Footer />
    </>
  );
}
