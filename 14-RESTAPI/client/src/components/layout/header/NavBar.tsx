import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Auth } from "@/lib/types/auth";
import { AlertsProvider } from "@/components/notifications/context/AlertsProvider";
import { ChatProvider } from "@/components/chat/context/ChatProvider";
import Notifications from "../../notifications/Notifications";
import ChatMenu from "../../chat/ChatMenu";
import IconButton from "../../ui/button/IconButton";
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

  const navProps = { disabled: deferring, layoutId: "nav-group" };

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
                  icon="rss"
              isActive={isActivePath(["feed", "post"])}
               onClick={() => navTo("/feed")}
              {...navProps}
            >
              Feed
            </IconButton>
            <IconButton
                  icon="users"
              isActive={isActivePath(["social", "user"])}
               onClick={() => navTo("/social")}
              {...navProps}
            >
              Social
            </IconButton>
            <AlertsProvider {...{ user, setUser }}>
              <Notifications />
            </AlertsProvider>
            <ChatProvider   {...{ user, setUser }}>
              <ChatMenu />
            </ChatProvider>
            <IconButton
                  icon="user"
              isActive={pathname === "/"}
               onClick={() => navTo("/")}
              {...navProps}
            >
              {user.name}
            </IconButton>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
