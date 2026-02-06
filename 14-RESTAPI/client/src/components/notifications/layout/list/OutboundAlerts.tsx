import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../../context/AlertsContext";
import User from "@/models/User";
import Button from "@/components/ui/button/Button";
import Time from "@/components/ui/tags/Time";
import NameTag from "@/components/ui/tags/NameTag";
import XButton from "@/components/ui/button/XButton";
import Heading from "@/components/ui/layout/Heading";
import { createAnimations } from "@/lib/motion/animations";
import shared from "./Shared.module.css";

const animations = createAnimations({ initial: { x: -20 }, animate: { x: 0 } });

export default function OutboundAlerts() {
  const { outboundReqs, clearSocial, friendRequest, navTo } = useAlerts();

  return (
    <AnimatePresence mode="popLayout">
      {outboundReqs.length > 0 ? (
        outboundReqs.map((connection) => {
          const { _id: alertId, accepted, initiated, user, createdAt } = connection;
          const peer = typeof user === "object" ? user : ({} as User); // user should be populated
          const { _id, name, surname } = peer;
          const onClick = () => navTo("/user/" + _id);
          const text = !accepted ? (
            <strong {...{ onClick }}>{name} {surname}</strong>
          ) : (
            <>
              <strong {...{ onClick }}>{name}</strong> accepted your friend request
            </>
          );

          return (
            <motion.li
                 layout
                    key={alertId + initiated}
              className={`box ${shared["alert"]}`}
              {...animations}
            >
              <Time time={createdAt} />
              <div className={shared["content"]}>
                <NameTag
                       key={accepted + ""}
                    layout
                      user={peer}
                     align="center"
                  overflow="line-clamp"
                >
                  {text}
                </NameTag>
                {!accepted ? (
                  <Button background="danger" onClick={() => friendRequest(_id, "delete")}>
                    Cancel
                  </Button>
                ) : (
                  <XButton light onClick={() => clearSocial(alertId)} />
                )}
              </div>
            </motion.li>
          );
        })
      ) : (
        <motion.li key="fallback" style={{ textAlign: "center" }}>
          <Heading>No sent requests</Heading>
        </motion.li>
      )}
    </AnimatePresence>
  );
}
