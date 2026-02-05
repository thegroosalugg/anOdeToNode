import { ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router-dom";
import Meta from "@/components/meta/Meta";
import NavBar from "@/components/layout/header/NavBar";
import Footer from "@/components/layout/footer/Footer";
import { useFetch } from "@/lib/hooks/useFetch";
import { saveTokens } from "@/lib/http/token";
import { postAnalytics } from "@/lib/http/analytics";
import { Auth } from "@/lib/types/auth";
import { Dict } from "@/lib/types/common";

const staticMeta: Dict<{ title: string; description: string }> = {
    "/feed": { title:               "Feed", description: "All user posts"          },
  "/social": { title:             "Social", description: "List of users"           },
   "/about": { title:              "About", description: "About page"              },
   "/terms": { title: "Terms & Conditions", description: "Terms & conditions page" },
};

const metadata = (path: string, user: Auth["user"]) => {
  if (path === "/") {
    return user
      ? { title: user.name, description: `${user.name}'s profile` }
      : { title: "Login",   description: "Sign up page"           };
  }

  return staticMeta[path] ?? { title: "", description: "" };
};

export default function RootLayout({ children }: { children: (props: Auth) => ReactNode }) {
  const { pathname } = useLocation();
  const {
         data: user,
      setData: setUser,
      reqData: reqUser,
    isLoading,
        error,
     setError,
  } = useFetch<Auth["user"]>(null, true); // null initial, true loading before useEffect
  const props = { user, setUser, reqUser, isLoading, error, setError };
  const { title, description } = metadata(pathname, user);

  useEffect(() => {
    reqUser({ url: "refresh-token/?populate=true", method: "POST" }, { onSuccess: (user) => saveTokens(user!), onError: () => setUser(null) });
    postAnalytics()
  }, [reqUser, setUser]);

  return (
    <>
      <Meta {...{ description }}>{title}</Meta>
      <NavBar {...props} />
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
