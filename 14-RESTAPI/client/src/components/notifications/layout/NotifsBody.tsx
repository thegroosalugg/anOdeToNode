import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../context/AlertsContext";
import NotifsHeader from "./header/NotifsHeader";
import InboundAlerts from "./list/InboundAlerts";
import OutboundAlerts from "./list/OutboundAlerts";
import ReplyAlerts from "./list/ReplyAlerts";
import Error from "@/components/ui/boundary/error/Error";
import { custom } from "@/lib/motion/animations";
import css from "./NotifsBody.module.css";

const tabs = [<InboundAlerts />, <OutboundAlerts />, <ReplyAlerts />];

export default function NotifsBody() {
  const { activeTab, direction, error } = useAlerts();

  return (
    <div className={css["notifications"]}>
      <NotifsHeader />
      <Error {...{ error }} />
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.ul
                  key={activeTab}
              custom={direction}
            variants={{ ...custom }}
              initial="enter"
              animate="center"
                exit="exit"
          transition={{ duration: 0.25, ease: "easeIn" }}
        >
          {tabs[activeTab]}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
