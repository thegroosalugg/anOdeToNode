import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { api } from "@/lib/http/endpoints";
import { ROUTES } from "@/routes/paths";
import Reply from "@/models/Reply";
import ConfirmDialog from "../../ui/modal/ConfirmDialog";
import NameTag from "../../ui/tags/NameTag";
import Time from "../../ui/tags/Time";
import SpinnerButton from "@/components/ui/button/SpinnerButton";
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
      <header onClick={() => navigate(ROUTES.toUser(creator._id))}>
        <NameTag user={creator} bold reverse={isCreator} />
        <Time time={createdAt} />
      </header>
      <p className="box">
        <span>{content}</span>

        {isCreator && (
          <SpinnerButton background="danger" onClick={() => setShowModal(true)} {...{ isLoading }}>
            {error ? error.message : "Delete"}
          </SpinnerButton>
        )}
      </p>
    </div>
  );
}
