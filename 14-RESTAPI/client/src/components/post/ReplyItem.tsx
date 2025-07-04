import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import Reply from "@/models/Reply";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import Button from "../ui/button/Button";
import css from "./ReplyItem.module.css";
import NameTag from "../ui/tags/NameTag";
import Time from "../ui/tags/Time";

export default function ReplyItem({
  _id,
  creator,
  content,
  createdAt,
  userId,
}: Reply & { userId: string }) {
  const [showModal, setShowModal] = useState(false);
  const { reqData } = useFetch();
  const navigate = useNavigate();
  const closeModal = () => setShowModal(false);
  const isOp = userId === creator._id;

  const deleteReply = async () => {
    await reqData({ url: `post/delete-reply/${_id}`, method: "DELETE" });
    closeModal();
  };

  return (
    <div className={`${css["reply"]} ${isOp ? css["reverse"] : ""}`}>
      <ConfirmDialog open={showModal} onCancel={closeModal} onConfirm={deleteReply} />
      <header onClick={() => navigate("/user/" + creator._id)}>
        <NameTag user={creator} bold reverse={isOp} />
        <Time time={createdAt} />
      </header>
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
