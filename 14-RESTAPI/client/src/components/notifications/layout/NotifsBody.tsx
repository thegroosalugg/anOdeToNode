import { AnimatePresence } from "motion/react";
import { useAlerts } from "../context/AlertsContext";
import NotifsHeader from "./header/NotifsHeader";
import AsyncAwait from "../../ui/boundary/AsyncAwait";
import SocialAlerts from "../layout/social/SocialAlerts";
import ReplyAlerts from "../layout/replies/ReplyAlerts";
import css from "./NotifsBody.module.css";

export default function NotifsBody() {
  const { user, setUser, replies, setReplies, activeTab, navTo, error, onError } =
    useAlerts();
  const { friends } = user;

  return (
    <div className={css["notifications"]}>
      <NotifsHeader />
      <AsyncAwait {...{ isLoading: false, error }}>
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
