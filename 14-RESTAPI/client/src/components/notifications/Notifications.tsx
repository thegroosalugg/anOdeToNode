import { AnimatePresence, motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAlerts } from "./context/AlertsContext";
import SideBar from "../ui/menu/SideBar";
import AsyncAwait from "../ui/boundary/AsyncAwait";
import SocialAlerts from "./SocialAlerts";
import ReplyAlerts from "./ReplyAlerts";
import IconButton from "../ui/button/IconButton";
import Counter from "../ui/counter/Counter";
import css from "./Notifications.module.css";

export default function Notifications() {
  const {
    user,
    setUser,
    replies,
    setReplies,
    isLoading,
    count,
    alerts,
    isOpen,
    openMenu,
    closeMenu,
    activeTab,
    changeTab,
    navTo,
    error,
    onError,
    deferring,
  } = useAlerts();

  const { friends } = user;
  const icons = ["envelope", "paper-plane", "reply"] as const;

  return (
    <>
      <SideBar open={isOpen} close={closeMenu}>
        <section className={css["menu-bar"]}>
          {alerts.map((count, i) => (
            <motion.button
              key={i}
              onClick={() => changeTab(i)}
              animate={{ color: activeTab === i ? "#888" : "var(--accent)" }}
            >
              <FontAwesomeIcon icon={icons[i]} size="xl" />
              <Counter {...{ count, pos: [15, 2, 0] }} />
            </motion.button>
          ))}
        </section>
        <AsyncAwait {...{ isLoading, error }}>
          <AnimatePresence mode="wait">
            {activeTab === 2 ? (
              <ReplyAlerts key="replies" {...{ replies, setReplies, navTo, onError }} />
            ) : (
              <SocialAlerts
                key="friends"
                {...{ setUser, friends, activeTab, navTo, onError }}
              />
            )}
          </AnimatePresence>
        </AsyncAwait>
      </SideBar>
      <IconButton icon="bell" onClick={openMenu} {...{ deferring }}>
        <Counter {...{ count }} />
        Alerts
      </IconButton>
    </>
  );
}
