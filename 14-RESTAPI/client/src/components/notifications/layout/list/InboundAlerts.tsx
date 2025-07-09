import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../../context/AlertsContext";
import User from "@/models/User";
import Time from "@/components/ui/tags/Time";
import Button from "@/components/ui/button/Button";
import NameTag from "@/components/ui/tags/NameTag";
import CloseButton from "@/components/ui/button/CloseButton";
import { createAnimations } from "@/lib/motion/animations";
import css from "./InboundAlerts.module.css";

const animations = createAnimations({ initial: { x: -20 }, animate: { x: 0 } });

export default function InboundAlerts() {
  const { inboundReqs, clearSocial, friendRequest, activeTab, navTo } = useAlerts();

  return (
    <AnimatePresence mode="popLayout">
      {inboundReqs.length > 0 ? (
        inboundReqs.map((connection) => {
          const { _id: alertId, accepted, initiated, user, createdAt } = connection;
          const peer = typeof user === "object" ? user : ({} as User); // user should be populated
          const { _id } = peer;
          const onClick = () => navTo("/user/" + _id);

          return (
            <motion.li
                 layout
                    key={alertId + accepted + initiated}
              className={`floating-box ${css["inbound-alert"]}`}
              {...animations}
            >
              <Time time={createdAt} />
              {!accepted && !initiated ? (
                <div>
                  <NameTag user={peer} {...{ onClick }} />
                  {" sent you a friend request"}
                  <div className={css["buttons"]}>
                    <Button onClick={() => friendRequest(_id, "accept")}>Accept</Button>
                    <Button onClick={() => friendRequest(_id, "delete")}>Decline</Button>
                  </div>
                </div>
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
        <motion.p key={activeTab} className={css["fallback"]}>
          {activeTab === 1 ? "No sent requests" : "You have no new notifications"}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
