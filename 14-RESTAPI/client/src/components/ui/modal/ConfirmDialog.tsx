import Modal from "./Modal";
import Button from "../button/Button";
import css from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
       open,
  onConfirm,
   onCancel,
}: {
       open: boolean;
  onConfirm: () => void;
   onCancel: () => void;
}) {
  return (
    <Modal {...{ open }} close={onCancel}>
      <div className={css["confirm-dialog"]}>
        <h2>Are you sure?</h2>
        <section>
          <Button background="danger" color="page" border="danger" onClick={onConfirm}>
            Probably
          </Button>
          <Button background="text-alt" color="page-alt" border="page-alt" onClick={onCancel}>
            Probably Not
          </Button>
        </section>
      </div>
    </Modal>
  );
}
