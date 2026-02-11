import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { useDefer } from "@/lib/hooks/useDefer";
import { UserNullState } from "@/lib/types/interface";
import { SetData } from "@/lib/types/common";
import { AlertsProvider } from "@/components/alerts/context/AlertsProvider";
import { ChatProvider } from "@/components/chat/context/ChatProvider";
import { Routes, ROUTES } from "@/routes/paths";
import ThemeToggle from "@/components/theme/ThemeToggle";
import AlertsMenu from "../../alerts/AlertsMenu";
import ChatMenu from "../../chat/ChatMenu";
import UserNavMenu from "@/components/user/actions/user/UserNavMenu";
import NavButton from "./NavButton";
import css from "./NavBar.module.css";

export type OffSet = { width: number, height: number };

interface NavBar extends UserNullState {
     offset: OffSet;
  setOffset: SetData<OffSet>;
}

const layoutId = "nav-group";
const { home, feed, social } = ROUTES;

export default function NavBar({ user, setUser, offset, setOffset }: NavBar) {
  const { deferring, defer } = useDefer();
  const   navigate   = useNavigate();
  const { pathname } = useLocation();
  const   segments   = pathname.split("/");
  const isActivePath = (paths: string[]) => paths.includes(segments[1]);
  const   headerRef  = useRef<HTMLDivElement>(null);

  function navTo(path: Routes) {
    defer(() => navigate(path), 1200);
  }

  useLayoutEffect(() => {
    const nav = headerRef.current;
    if (!nav) return;

    const updateOffset = () => {
      setOffset({ height: nav.offsetHeight, width: nav.offsetWidth });
    };

    const observer = new ResizeObserver(updateOffset);
    observer.observe(nav);
    updateOffset();

    return () => observer.disconnect();
  }, [setOffset]);

  return (
    <header className={css["header"]} ref={headerRef}>
      <h1 onClick={() => navTo(home)}>
        <span>Friendface</span> {/* large display swap */}
        <span>F</span>
      </h1>
      <AnimatePresence>
        {!user ? (
          <ThemeToggle style={{ marginLeft: "auto" }} />
        ) : (
          <motion.nav
             className={css["nav"]}
               initial="hidden"
               animate="visible"
                  exit={{ opacity: 0 }}
            transition={{ staggerChildren: 0.2 }}
          >
            <NavButton
                  icon="rss"
              isActive={isActivePath(["feed", "post"])}
               onClick={() => navTo(feed)}
              disabled={deferring}
              {...{ layoutId }}
            >
              Feed
            </NavButton>
            <NavButton
                  icon="users"
              isActive={isActivePath(["social", "user"])}
               onClick={() => navTo(social)}
              disabled={deferring}
              {...{ layoutId }}
            >
              Social
            </NavButton>
            <AlertsProvider {...{ user, setUser }}>
              <AlertsMenu />
            </AlertsProvider>
            <ChatProvider {...{ user, setUser }}>
              <ChatMenu />
            </ChatProvider>
            <UserNavMenu {...{ user, setUser, pathname, navTo, deferring, layoutId, offset }} />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
