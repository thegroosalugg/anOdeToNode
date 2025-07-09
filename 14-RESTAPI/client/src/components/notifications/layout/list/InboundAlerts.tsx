import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../../context/AlertsContext";
import User from "@/models/User";
import Time from "@/components/ui/tags/Time";
import Button from "@/components/ui/button/Button";
import NameTag from "@/components/ui/tags/NameTag";
import XButton from "@/components/ui/button/XButton";
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
          const { _id, name, surname } = peer;
          const onClick = () => navTo("/user/" + _id);
          const text = accepted ? (
            <>You accepted <strong {...{ onClick }}>{name}'s</strong> friend request</>
          ) : (
            <>
              <strong {...{ onClick }}>{name} {surname} </strong>
              sent you a friend request
            </>
          );

          return (
            <motion.li
                 layout
                    key={alertId + initiated}
              className={`floating-box ${css["inbound-alert"]}`}
              {...animations}
            >
              <Time time={createdAt} />
              <div className={`no-scrollbar-x ${css["content"]}`}>
                <NameTag
                    layout
                       key={accepted + ""}
                      user={peer}
                     align="center"
                  overflow="line-clamp"
                >
                  {text}
                </NameTag>
                {accepted && <XButton light onClick={() => clearSocial(alertId)} />}
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
        <motion.li key="fallback" style={{ textAlign: "center" }}>
          <Heading>You have no new notifications</Heading>
        </motion.li>
      )}
    </AnimatePresence>
  );
}
