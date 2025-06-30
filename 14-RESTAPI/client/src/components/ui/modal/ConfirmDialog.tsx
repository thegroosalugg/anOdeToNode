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
          <Button color="var(--bg)" background="var(--error)" onClick={onConfirm}>
            Probably
          </Button>
          <Button color="var(--fg)" background="var(--box)"   onClick={onCancel}>
            Probably Not
          </Button>
        </section>
      </div>
    </Modal>
  );
}
