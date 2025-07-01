import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Auth } from "@/lib/types/auth";
import IconButton from "../../ui/button/IconButton";
import Notifications from "../../notifications/Notifications";
import ChatMenu from "../../chat/ChatMenu";
import { ChatProvider } from "@/components/chat/context/ChatProvider";
import css from "./NavBar.module.css";

export default function NavBar({ user, setUser }: Auth) {
  const { deferring, deferFn } = useDebounce();
  const   navigate   = useNavigate();
  const { pathname } = useLocation();
  const   segments   = pathname.split("/");
  const isActivePath = (paths: string[]) => paths.includes(segments[1]);

  function navTo(path: string) {
    deferFn(() => navigate(path), 1200);
  }

  return (
    <header className={css["header"]}>
      <h1>
        <span>Friendface</span> {/* large display swap */}
        <span>F</span>
      </h1>
      <AnimatePresence>
        {user && (
          <motion.nav
             className={css["nav"]}
               initial="hidden"
               animate="visible"
                  exit={{ opacity: 0 }}
            transition={{ staggerChildren: 0.2 }}
          >
            <IconButton
              isActive={isActivePath(["feed", "post"])}
                  icon="rss"
               onClick={() => navTo("/feed")}
              {...{ deferring }}
            >
              Feed
            </IconButton>
            <IconButton
                  icon="users"
              isActive={isActivePath(["social", "user"])}
               onClick={() => navTo("/social")}
              {...{ deferring }}
            >
              Social
            </IconButton>
            <Notifications {...{ user, setUser }} />
            <ChatProvider  {...{ user, setUser }}>
              <ChatMenu />
            </ChatProvider>
            <IconButton
              isActive={pathname === "/"}
                  icon="user"
               onClick={() => navTo("/")}
              {...{ deferring }}
            >
              {user.name}
            </IconButton>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
