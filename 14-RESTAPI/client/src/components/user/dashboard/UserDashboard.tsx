import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Auth } from "@/lib/types/auth";
import { useFetch } from "@/lib/hooks/useFetch";
import User from "@/models/User";
import Friend from "@/models/Friend";
import UserItem from "@/components/list/user/UserItem";
import Loader from "@/components/ui/boundary/loader/Loader";
import Button from "@/components/ui/button/Button";
import UserAbout from "./UserAbout";
import ConfirmDialog from "@/components/ui/modal/ConfirmDialog";
import { actionsConfig } from "./actions_config";
import css from "./UserDashboard.module.css";

export default function UserDashboard({
     user,
  setUser,
     peer,
}: {
     user: User;
  setUser: Auth["setUser"];
     peer: User;
}) {
  const { isLoading,    reqData } = useFetch();
  const { deferring,    deferFn } = useDebounce();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { _id } = peer;

  const connection = user.friends.find((friend) => Friend.getId(friend) === _id);
  const { accepted, initiated, acceptedAt } = connection ?? {};
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
      navigate("?chat=" + peer._id);
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
      <motion.article
        className={css["user-dashboard"]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <section>
          <UserItem
            className={css["user-photo"]}
            target={peer}
            watcher={user}
            font="line-clamp"
          />

          <div className={css["actions"]}>
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

            {(accepted || (connection && !initiated)) && (
              <Button onClick={deleteFriend} background="var(--error)">
                {accepted ? (
                  "Remove Friend"
                ) : (
                  <span>
                    Decline <FontAwesomeIcon icon="rectangle-xmark" size="xs" />
                  </span>
                )}
              </Button>
            )}
          </div>
        </section>

        <UserAbout {...{ user, acceptedAt }} />
      </motion.article>
    </>
  );
}
