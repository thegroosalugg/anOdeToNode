import { AnimatePresence } from "motion/react";
import { useChat } from "../../context/ChatContext";
import Modal from "@/components/ui/modal/Modal";
import ConfirmDialog from "@/components/ui/modal/ConfirmDialog";
import Button from "@/components/ui/button/Button";
import css from "./ChatActions.module.css";

interface ActionProps {
      showModal: boolean;
     closeModal: () => void;
      isMarking: boolean;
  confirmAction: () => void;
   cancelAction: () => void;
   deleteAction: () => void;
}

export default function ChatActions({
      showModal,
     closeModal,
      isMarking,
  confirmAction,
   cancelAction,
   deleteAction,
}: ActionProps) {
  const { isActive } = useChat();
  const canDelete = isMarking || isActive;
  const      color = canDelete ?    "var(--bg)" : "var(--fg)"
  const background = canDelete ? "var(--error)" : "var(--box)";
  
  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <ConfirmDialog onCancel={closeModal} onConfirm={deleteAction} />
      </Modal>
      <header className={css["chat-actions"]}>
        <Button {...{ color, background }} onClick={confirmAction}>
          {canDelete ? "Delete" : "Select"} Chat{!isActive ? "s" : ""}
        </Button>
        <AnimatePresence>
          {isMarking && (
            <Button exit={{ opacity: 0 }} onClick={cancelAction}>
              Cancel
            </Button>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
