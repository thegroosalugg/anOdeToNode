import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { api } from "@/lib/http/endpoints";
import Reply from "@/models/Reply";
import ConfirmDialog from "../../ui/modal/ConfirmDialog";
import Button from "../../ui/button/Button";
import NameTag from "../../ui/tags/NameTag";
import Time from "../../ui/tags/Time";
import css from "./ReplyItem.module.css";

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
  let classes = css["reply"];
  const isOp = userId === creator._id;
  if (isOp) classes += ` ${css["reverse"]}`;

  const deleteReply = async () => {
    await reqData({ url: api.post.deleteReply(_id), method: "DELETE" });
    closeModal();
  };

  return (
    <div className={classes}>
      <ConfirmDialog open={showModal} onCancel={closeModal} onConfirm={deleteReply} />
      <header onClick={() => navigate("/user/" + creator._id)}>
        <NameTag user={creator} bold reverse={isOp} />
        <Time time={createdAt} />
      </header>
      <p className="box">
        <span>{content}</span>

        {isOp && (
          <Button background="var(--danger)" onClick={() => setShowModal(true)}>
            Delete
          </Button>
        )}
      </p>
    </div>
  );
}
