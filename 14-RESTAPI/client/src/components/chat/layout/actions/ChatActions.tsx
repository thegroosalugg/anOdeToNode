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

  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <ConfirmDialog onCancel={closeModal} onConfirm={deleteAction} />
      </Modal>
      <header className={css["chat-actions"]}>
        <Button
               color={isMarking || isActive ?    "var(--bg)" : "var(--fg)"}
          background={isMarking || isActive ? "var(--error)" : "var(--box)"}
          onClick={confirmAction}
        >
          {isMarking || isActive ? "Delete" : "Select"} Chat{!isActive ? "s" : ""}
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
