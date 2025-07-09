import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../../context/AlertsContext";
import User from "@/models/User";
import Button from "@/components/ui/button/Button";
import Time from "@/components/ui/tags/Time";
import NameTag from "@/components/ui/tags/NameTag";
import CloseButton from "@/components/ui/button/CloseButton";
import Heading from "@/components/ui/layout/Heading";
import { createAnimations } from "@/lib/motion/animations";
import css from "./OutboundAlerts.module.css";

const animations = createAnimations({ initial: { x: -20 }, animate: { x: 0 } });

export default function OutboundAlerts() {
  const { outboundReqs, clearSocial, friendRequest, activeTab, navTo } = useAlerts();

  return (
    <AnimatePresence mode="popLayout">
      {outboundReqs.length > 0 ? (
        outboundReqs.map((connection) => {
          const { _id: alertId, accepted, initiated, user, createdAt } = connection;
          const peer = typeof user === "object" ? user : ({} as User); // user should be populated
          const { _id } = peer;
          const onClick = () => navTo("/user/" + _id);

          return (
            <motion.li
              layout
              key={alertId + accepted + initiated}
              className={`floating-box ${css["outbound-alert"]}`}
              {...animations}
            >
              <Time time={createdAt} />
              {!accepted && initiated ? (
                <>
                  <NameTag user={peer} {...{ onClick }} />
                  <Button
                    className={css["cancel-btn"]}
                    onClick={() => friendRequest(_id, "delete")}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <NameTag user={peer} {...{ onClick }} />
                  {" accepted your friend request"}
                  <CloseButton onClick={() => clearSocial(alertId)} />
                </>
              )}
            </motion.li>
          );
        })
      ) : (
        <motion.li key="fallback">
          <Heading>No sent requests</Heading>
        </motion.li>
      )}
    </AnimatePresence>
  );
}
