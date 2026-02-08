import { ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router-dom";
import Meta from "@/components/meta/Meta";
import NavBar from "@/components/layout/header/NavBar";
import Footer from "@/components/layout/footer/Footer";
import { useFetch } from "@/lib/hooks/useFetch";
import { api } from "@/lib/http/endpoints";
import { eventBus } from "@/lib/util/eventBus";
import { saveTokens } from "@/lib/http/token";
import { postAnalytics } from "@/lib/http/analytics";
import User from "@/models/User";
import { RecordMap } from "@/lib/types/common";
import { Auth } from "@/lib/types/interface";

const staticMeta: RecordMap<{ title: string; description: string }> = {
    "/feed": { title:               "Feed", description: "All user posts"          },
  "/social": { title:             "Social", description: "List of users"           },
   "/about": { title:              "About", description: "About page"              },
   "/terms": { title: "Terms & Conditions", description: "Terms & conditions page" },
};

const metadata = (path: string, user: User | null) => {
  if (path === "/") {
    return user
      ? { title: user.name, description: `${user.name}'s profile` }
      : { title: "Login",   description: "Sign up page"           };
  }

  return staticMeta[path] ?? { title: "", description: "" };
};

export default function RootLayout({ children }: { children: (props: Auth) => ReactNode }) {
  const { pathname } = useLocation();
  const { data: user, setData: setUser, reqData, isLoading } = useFetch<User>();
  const props = { user, setUser, isLoading };
  const { title, description } = metadata(pathname, user);

  useEffect(() => {
    reqData({ url: api.user.refresh({ populate: true }), method: "POST", onSuccess: (user) => saveTokens(user) });
    postAnalytics();
    const unsubscribe = eventBus.on("logout", () => setUser(null));
    return unsubscribe; // clean-up - called on dismount
  }, [reqData, setUser]);

  return (
    <>
      <Meta {...{ description }}>{title}</Meta>
      <NavBar {...{ user, setUser }} />
      <AnimatePresence mode="wait">
        <motion.main
                  id="main"
                 key={pathname}
                exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children(props)}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}
