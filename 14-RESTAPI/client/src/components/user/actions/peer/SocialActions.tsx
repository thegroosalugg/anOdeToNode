import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserState } from "@/lib/types/auth";
import User from "@/models/User";
import Friend from "@/models/Friend";
import Loader from "@/components/ui/boundary/loader/Loader";
import Button from "@/components/ui/button/Button";
import ConfirmDialog from "@/components/ui/modal/ConfirmDialog";
import { actionsConfig } from "./actions_config";
import css from "./SocialActions.module.css";

export default function SocialActions({ user, setUser, peer }: UserState & { peer: User }) {
  const { isLoading,    reqData } = useFetch();
  const { deferring,    deferFn } = useDebounce();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { _id } = peer;

  const connection = Friend.getConnection(user, peer);
  const { accepted, initiated } = connection ?? {};
  const { text, icon, action, background } = actionsConfig(connection);
  const closeModal = () => setShowModal(false);

  const friendRequest = async (reqAction = action) => {
    if (!reqAction) return; // action = undefined if connection accepted
    // in this case an argument must be passed
    const request = async () =>
      await reqData(
        { url: `social/${_id}/${reqAction}`, method: "POST" },
        {
          onError: (err) => {
            if (err.status === 401) setUser(null);
          },
        }
      );
    deferFn(request, 1000);
  };

  async function handleAction() {
    if (!accepted) {
      await friendRequest();
    } else {
      navigate("?chat=" + _id);
    }
  }

  async function deleteFriend() {
    if (accepted) {
      setShowModal(true);
    } else if (connection && !initiated) {
      await friendRequest("delete");
    }
  }

  return (
    <>
      <ConfirmDialog
             open={showModal}
        onConfirm={async () => {
          await friendRequest("delete");
          closeModal();
        }}
        onCancel={closeModal}
      />
      <div className={css["social-actions"]}>
        <Button onClick={handleAction} {...{ background }} disabled={deferring}>
          {isLoading ? (
            <Loader size="xs" color="bg" />
          ) : (
            <span>
              {text}
              <FontAwesomeIcon {...{ icon }} size="xs" />
            </span>
          )}
        </Button>

        <AnimatePresence>
          {(accepted || (connection && !initiated)) && (
            <Button onClick={deleteFriend} background="var(--error)" exit={{ opacity: 0 }}>
              {accepted ? (
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
