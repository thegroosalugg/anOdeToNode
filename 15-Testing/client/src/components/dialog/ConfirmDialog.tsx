import Button from '../button/Button';
import css from './ConfirmDialog.module.css';

export default function ConfirmDialog({
  onConfirm,
   onCancel,
}: {
  onConfirm: () => void;
   onCancel: () => void;
}) {
  return (
    <div className={css['confirm-dialog']}>
      <h2>Are you sure?</h2>
      <section>
        <Button hsl={[10, 54, 51]} onClick={onConfirm}>Probably</Button>
        <Button hsl={[ 0,  8, 88]} onClick={onCancel}>Probably Not</Button>
      </section>
    </div>
  );
}
