import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import { useDefer } from "@/lib/hooks/useDefer";
import { UserNullState } from "@/lib/types/interface";
import { AlertsProvider } from "@/components/alerts/context/AlertsProvider";
import { ChatProvider } from "@/components/chat/context/ChatProvider";
import AlertsMenu from "../../alerts/AlertsMenu";
import ChatMenu from "../../chat/ChatMenu";
import UserNavMenu from "@/components/user/actions/user/UserNavMenu";
import NavButton from "./NavButton";
import css from "./NavBar.module.css";

const layoutId = "nav-group";

export default function NavBar({ user, setUser }: UserNullState) {
  const { deferring, defer } = useDefer();
  const [offset,  setOffset] = useState(0);
  const   navigate   = useNavigate();
  const { pathname } = useLocation();
  const   segments   = pathname.split("/");
  const isActivePath = (paths: string[]) => paths.includes(segments[1]);
  const    headerRef = useRef<HTMLDivElement>(null);

  function navTo(path: string) {
    defer(() => navigate(path), 1200);
  }

  useLayoutEffect(() => {
    const nav = headerRef.current;
    const main = document.getElementById("main");
    if (!nav || !main) return;

    const updateOffset = () => {
      const isLandscapeMobile = window.matchMedia("(pointer: coarse) and (orientation: landscape)").matches;
      setOffset(nav[`offset${isLandscapeMobile ? "Width" : "Height"}`]);
      main.style.marginLeft = `${isLandscapeMobile ? nav.offsetWidth : 0}px`;
    };

    const observer = new ResizeObserver(updateOffset);
    observer.observe(nav);
    updateOffset();

    return () => observer.disconnect();
  }, []);

  return (
    <header className={css["header"]} ref={headerRef}>
      <h1 onClick={() => navTo("/")}>
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
            <NavButton
                  icon="rss"
              isActive={isActivePath(["feed", "post"])}
               onClick={() => navTo("/feed")}
              disabled={deferring}
              {...{ layoutId }}
            >
              Feed
            </NavButton>
            <NavButton
                  icon="users"
              isActive={isActivePath(["social", "user"])}
               onClick={() => navTo("/social")}
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
