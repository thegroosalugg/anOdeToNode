import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { actionsConfig } from "./actions_config";
import { Auth } from "@/lib/types/auth";
import { useFetch } from "@/lib/hooks/useFetch";
import User from "@/models/User";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import ProfilePic from "../ui/image/ProfilePic";
import Button from "../ui/button/Button";
import Loader from "../ui/boundary/loader/Loader";
import { formatDate } from "@/lib/util/timeStamps";
import Friend from "@/models/Friend";
import css from "./PeerProfile.module.css";

const prefixes = ["Lives in", "Works at", "Studied at", ""];
const icons = ["house", "briefcase", "book", "comment-dots"] as const;

const InfoTag = ({ text, i }: { text?: string; i: number }) => {
  if (!text) return null;
  return (
    text && (
      <p className={css["info-tag"]}>
        <FontAwesomeIcon icon={icons[i]} /> {prefixes[i]} {text}
      </p>
    )
  );
};

export default function PeerProfile({
  user,
  setUser,
  peer,
}: {
  user: User;
  setUser: Auth["setUser"];
  peer: User;
}) {
  const { isLoading, reqData } = useFetch();
  const { deferring, deferFn } = useDebounce();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { _id, name, surname, createdAt, about } = peer;
  const { bio, home, study, work } = about ?? {};

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
      <motion.section
        className={css["user-profile"]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <div className={css["profile-pic"]}>
          <div>
            <ProfilePic user={peer} />
            <h2>
              {name} {surname}
            </h2>
          </div>

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

        <div className={css["user-info"]}>
          <h2>Joined on {formatDate(createdAt, ["year"])}</h2>
          {acceptedAt && (
            <h2>You have been friends since {formatDate(acceptedAt, ["year"])}</h2>
          )}
          <InfoTag {...{ text: home, i: 0 }} />
          <InfoTag {...{ text: work, i: 1 }} />
          <InfoTag {...{ text: study, i: 2 }} />
          <InfoTag {...{ text: bio, i: 3 }} />
        </div>
      </motion.section>
    </>
  );
}
