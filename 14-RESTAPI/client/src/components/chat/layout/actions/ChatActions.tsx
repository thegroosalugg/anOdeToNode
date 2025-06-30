import { AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChat } from "../../context/ChatContext";
import ConfirmDialog from "@/components/ui/modal/ConfirmDialog";
import Button from "@/components/ui/button/Button";
import css from "./ChatActions.module.css";

export default function ChatActions() {
  const {
    activeChat,
    showModal,
    closeModal,
    isMarking,
    confirmAction,
    cancelAction,
    deleteAction,
    closeMenu,
  } = useChat();
  const  canDelete = isMarking || activeChat;
  const      color = canDelete ?    "var(--bg)" : "var(--fg)";
  const background = canDelete ? "var(--error)" : "var(--box)";

  return (
    <>
      <ConfirmDialog open={showModal} onCancel={closeModal} onConfirm={deleteAction} />
      <header className={css["chat-actions"]}>
        <div>
          <Button {...{ color, background }} border onClick={confirmAction}>
            {canDelete ? "Delete" : "Select"} Chat{!activeChat ? "s" : ""}
          </Button>
          <AnimatePresence>
            {isMarking && (
              <Button exit={{ opacity: 0 }} onClick={cancelAction}>
                Cancel
              </Button>
            )}
          </AnimatePresence>
        </div>
        <Button background="var(--text)" onClick={closeMenu}>
          <FontAwesomeIcon icon="x" />
        </Button>
      </header>
    </>
  );
}
