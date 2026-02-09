import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "@/lib/http/endpoints";
import User from "@/models/User";
import Friend from "@/models/Friend";
import Spinner from "@/components/ui/boundary/loader/Spinner";
import Button from "@/components/ui/button/Button";
import Error from "@/components/ui/boundary/error/Error";
import ConfirmDialog from "@/components/ui/modal/ConfirmDialog";
import { actionsConfig } from "./actions_config";
import css from "./SocialActions.module.css";

const Loader = <Spinner size="xs" color="page" />;

export default function SocialActions({ user, peer }: { user: User; peer: User }) {
  const { isLoading, error, setError, reqData } = useFetch();
  const [showModal, setShowModal] = useState(false);
  const [isPrimaryAction, setIsPrimaryAction] = useState(true);

  const navigate = useNavigate();
  const { _id } = peer;

  const connection = Friend.getConnection({ target: user, watcher: peer});
  const { accepted, initiated } = connection ?? {};
  const { text, icon, action, background } = actionsConfig(connection);
  const closeModal = () => setShowModal(false);

  const friendRequest = (reqAction = action) => {
    setError(null); // reset errors on new action
    if (!reqAction || isLoading) return; // action = undefined if connection accepted
    // in this case an argument must be passed
    reqData({ url: api.social.request({ id: _id, action: reqAction }), method: "POST" });
  };

  function handleAction() {
    setIsPrimaryAction(true); // tells loader in left side button to spin
    if (!accepted) friendRequest();
    else           navigate("?chat=" + _id);
  }

  function deleteFriend() {
    setIsPrimaryAction(false); // tells loader in right side button to spin
         if (accepted)                 setShowModal(true);
    else if (connection && !initiated) friendRequest("delete");
  }

   return (
    <>
      <ConfirmDialog
        open={showModal}
        onConfirm={() => {
          friendRequest("delete");
          closeModal();
        }}
        onCancel={closeModal}
      />

      <Error {...{ error }} />

      <div className={css["social-actions"]}>
        <Button onClick={handleAction} {...{ background }} disabled={isLoading}>
          {isLoading && isPrimaryAction ? (
            Loader
          ) : (
            <span>
              {text}
              <FontAwesomeIcon {...{ icon }} size="xs" />
            </span>
          )}
        </Button>

        <AnimatePresence>
          {(accepted || (connection && !initiated)) && (
            <Button onClick={deleteFriend} background="danger" disabled={isLoading} exit={{ opacity: 0 }}>
              {isLoading && !isPrimaryAction ? (
                Loader
              ) : accepted ? (
                "Remove Friend"
              ) : (
                <span>
                  Decline <FontAwesomeIcon icon="rectangle-xmark" size="xs" />
                </span>
              )}
            </Button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
