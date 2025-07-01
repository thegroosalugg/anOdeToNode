import { AnimatePresence, motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAlerts } from "../context/AlertsContext";
import AsyncAwait from "../../ui/boundary/AsyncAwait";
import SocialAlerts from "../layout/social/SocialAlerts";
import ReplyAlerts from "../layout/replies/ReplyAlerts";
import Counter from "../../ui/counter/Counter";
import css from "./NotifsBody.module.css";

export default function NotifsBody() {
  const {
    user,
    setUser,
    replies,
    setReplies,
    isLoading,
    alerts,
    activeTab,
    changeTab,
    navTo,
    error,
    onError,
  } = useAlerts();
  const { friends } = user;
  const icons = ["envelope", "paper-plane", "reply"] as const;

  return (
    <div className={css["notifications"]}>
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
    </div>
  );
}
