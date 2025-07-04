import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import Reply from "@/models/Reply";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import ProfilePic from "../ui/image/ProfilePic";
import Button from "../ui/button/Button";
import { timeAgo } from "@/lib/util/timeStamps";
import css from "./ReplyItem.module.css";

const Truncate = ({ children }: { children: ReactNode }) => (
  <span className="truncate">{children}</span>
);

export default function ReplyItem({
  _id,
  creator,
  content,
  createdAt,
  userId,
}: Reply & { userId?: string }) {
  const [showModal, setShowModal] = useState(false);
  const { reqData } = useFetch();
  const navigate = useNavigate();
  const closeModal = () => setShowModal(false);
  const { name = "account", surname = "deleted" } = creator;
  const isOp = userId === creator._id;

  const deleteReply = async () => {
    await reqData({ url: `post/delete-reply/${_id}`, method: "DELETE" });
    closeModal();
  };

  return (
    <div className={`${css["reply"]} ${isOp ? css["reverse"] : ""}`}>
      <ConfirmDialog open={showModal} onCancel={closeModal} onConfirm={deleteReply} />
      <h2 onClick={() => navigate("/user/" + creator._id)}>
        <ProfilePic user={creator} />
        <Truncate>
          {name} {surname}
        </Truncate>
        <Truncate>{timeAgo(createdAt)}</Truncate>
      </h2>
      <p className="floating-box">
        <span>{content}</span>

        {isOp && (
          <Button background="var(--error)" onClick={() => setShowModal(true)}>
            Delete
          </Button>
        )}
      </p>
    </div>
  );
}
