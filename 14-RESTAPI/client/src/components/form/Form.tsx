import Button from '../button/Button';
import css from './Form.module.css';
import Input from './Input';

export default function Form({ dataFn }: { dataFn: (data: object) => void }) {
  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    dataFn(data);
  }

  return (
    <form className={css.form} onSubmit={submitHandler}>
      <Input id='title' />
      <Input id='content' text rows={5} />
      <Button hsl={[37, 96, 45]}>Post</Button>
    </form>
  );
}
