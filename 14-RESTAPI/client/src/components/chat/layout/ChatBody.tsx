import { useState } from "react";
import useFetch from "@/lib/hooks/useFetch";
import Chat from "@/models/Chat";
import AsyncAwait from "../../ui/boundary/AsyncAwait";
import css from "./ChatBody.module.css";
import { useChat } from "../context/ChatContext";
import ChatActions from "./actions/ChatActions";
import ChatList from "./list/ChatList";

export default function ChatBody() {
  const { reqHandler } = useFetch<Chat[]>([]);
  const { error, isActive, isInitial, expand } = useChat();
  const [isMarking, setIsMarking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [marked,       setMarked] = useState<Record<string, boolean>>({});
  const  wasMarked = Object.keys(marked).some((key) => marked[key]);
  const closeModal = () => setShowModal(false);

  function expandOrMark(chat: Chat, path: string) {
    if (isMarking) {
      setMarked((state) => ({ ...state, [chat._id]: !state[chat._id] }));
    } else {
      expand(chat, path);
    }
  }

  function confirmAction() {
    if ((isMarking && wasMarked) || isActive) {
      setShowModal(true);
    } else {
      setIsMarking(true);
    }
  }

  async function deleteAction() {
    if (!(isMarking || isActive)) return;

    let data;
    if (wasMarked) {
      data = Object.fromEntries(Object.entries(marked).filter(([_, v]) => v));
    } else if (isActive) {
      data = { [isActive._id]: true };
    }

    if (!data) return;

    await reqHandler({ url: "chat/delete", method: "DELETE", data });
    if (wasMarked) setMarked({});
    closeModal();
    setIsMarking(false);
  }

  function cancelAction() {
    setIsMarking(false);
    setMarked({});
  }

  return (
    <div className={css["chat-body"]}>
      <AsyncAwait {...{ isLoading: isInitial, error }}>
        <ChatActions
          {...{
            showModal,
            closeModal,
            isMarking,
            confirmAction,
            cancelAction,
            deleteAction,
          }}
        />
        <ChatList {...{ marked, expandOrMark }} />
      </AsyncAwait>
    </div>
  );
}
