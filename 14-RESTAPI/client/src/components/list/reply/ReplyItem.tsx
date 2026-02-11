import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { api } from "@/lib/http/endpoints";
import Reply from "@/models/Reply";
import ConfirmDialog from "../../ui/modal/ConfirmDialog";
import Button from "../../ui/button/Button";
import Spinner from "@/components/ui/boundary/loader/Spinner";
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
  const { reqData, isLoading, error } = useFetch();
  const navigate = useNavigate();
  const closeModal = () => setShowModal(false);
  let classes = css["reply"];
  const isCreator = userId === creator._id;
  if (isCreator) classes += ` ${css["reverse"]}`;

  const deleteReply = () => {
    reqData({ url: api.post.deleteReply(_id), method: "DELETE" });
    closeModal();
  };

  return (
    <div className={classes}>
      <ConfirmDialog open={showModal} onCancel={closeModal} onConfirm={deleteReply} />
      <header onClick={() => navigate("/user/" + creator._id)}>
        <NameTag user={creator} bold reverse={isCreator} />
        <Time time={createdAt} />
      </header>
      <p className="box">
        <span>{content}</span>

        {isCreator && (
          <Button background="danger" onClick={() => setShowModal(true)} disabled={isLoading}>
            {isLoading ? <Spinner size={20} color="page" /> : error ? error.message : "Delete"}
          </Button>
        )}
      </p>
    </div>
  );
}
