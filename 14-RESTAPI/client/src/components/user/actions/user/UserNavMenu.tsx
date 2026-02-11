import { useState, useEffect } from "react";
import { UserState } from "@/lib/types/interface";
import { createPortal } from "react-dom";
import NavButton from "@/components/layout/header/NavButton";
import ConfirmDialog from "@/components/ui/modal/ConfirmDialog";
import { removeRefreshToken } from "@/lib/http/token";
import css from "./UserNavMenu.module.css";

const userNavMenu = "user-nav-menu";
const STORAGE_KEY = "dark-theme";

interface UserNavMenu extends UserState {
   pathname: string;
      navTo: (path: string) => void;
  deferring: boolean;
   layoutId: string;
     offset: number;
}

export default function UserNavMenu({
       user,
    setUser,
   pathname,
      navTo,
  deferring,
   layoutId,
     offset,
   ...props
}: UserNavMenu) {
  const [showMenu,   setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDark,       setIsDark] = useState(() => localStorage.getItem(STORAGE_KEY) !== null);
  const   openMenu = () => setShowMenu(true);
  const  closeMenu = () => setShowMenu(false);
  const  openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  let classes = css[userNavMenu];
  if (showMenu) classes += ` ${css["visible"]}`;

  function logout() {
    closeModal();
    setUser(null);
    removeRefreshToken();
  }

  const navToProfile = () => {
    closeMenu();
    navTo("/");
  };

  const confirmLogout = () => {
    closeMenu();
    openModal();
  }

  const setTheme = () => {
    if (!isDark) localStorage.setItem(STORAGE_KEY, "1");
    else         localStorage.removeItem(STORAGE_KEY);
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }, [isDark]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      const menu = document.getElementById(userNavMenu);
      if (!menu || menu.contains(e.target as Node)) return;
      setShowMenu(false);
    }

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const element = (
    <div
             id={userNavMenu}
      className={classes}
          style={{ "--offset": `${offset - 16}px` } as React.CSSProperties}
    >
      <button onClick={setTheme}>{isDark ? "🌑" : "☀️"}</button>
      <button onClick={navToProfile}>Profile</button>
      <button onClick={confirmLogout}>Logout</button>
    </div>
  );

  const root = document.getElementById("root");
  const Menu = root ? createPortal(element, root) : element;

  return (
    <>
      <ConfirmDialog open={showModal} onConfirm={logout} onCancel={closeModal} />
      {Menu}
      <NavButton
        icon="user"
        isActive={pathname === "/"}
        disabled={deferring}
        onClick={openMenu}
        {...{ layoutId }}
        {...props}
      >
        {user.name}
      </NavButton>
    </>
  );
}
