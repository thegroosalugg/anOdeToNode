import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../../context/AlertsContext";
import User from "@/models/User";
import Time from "@/components/ui/tags/Time";
import Button from "@/components/ui/button/Button";
import NameTag from "@/components/ui/tags/NameTag";
import CloseButton from "@/components/ui/button/CloseButton";
import Heading from "@/components/ui/layout/Heading";
import { createAnimations } from "@/lib/motion/animations";
import css from "./InboundAlerts.module.css";

const animations = createAnimations({ initial: { x: -20 }, animate: { x: 0 } });

export default function InboundAlerts() {
  const { inboundReqs, clearSocial, friendRequest, navTo } = useAlerts();

  return (
    <AnimatePresence mode="popLayout">
      {inboundReqs.length > 0 ? (
        inboundReqs.map((connection) => {
          const { _id: alertId, accepted, initiated, user, createdAt } = connection;
          const peer = typeof user === "object" ? user : ({} as User); // user should be populated
          const { _id } = peer;
          const onClick = () => navTo("/user/" + _id);
          const text = accepted
            ? " accepted your friend request"
            : " sent you a friend request";

          return (
            <motion.li
                 layout
                    key={alertId + accepted + initiated}
              className={`floating-box ${css["inbound-alert"]}`}
              {...animations}
            >
              <Time time={createdAt} />
              <div className={`no-scrollbar-x ${css["content"]}`}>
                <NameTag
                      user={peer}
                      bold
                     align="center"
                  overflow="line-clamp"
                  {...{ onClick }}
                >
                  {text}
                </NameTag>
                {accepted && (
                  <CloseButton
                    background="var(--bg)"
                         color="var(--fg)"
                       onClick={() => clearSocial(alertId)}
                  />
                )}
              </div>
              {!accepted && (
                <div className={css["actions"]}>
                  <Button
                    background="var(--accept)"
                       onClick={() => friendRequest(_id, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    background="var(--error)"
                       onClick={() => friendRequest(_id, "delete")}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </motion.li>
          );
        })
      ) : (
        <motion.li key="fallback">
          <Heading>You have no new notifications</Heading>
        </motion.li>
      )}
    </AnimatePresence>
  );
}
