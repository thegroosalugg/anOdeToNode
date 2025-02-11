import { Auth } from '@/pages/RootLayout';
import Chat from '@/models/Chat';
import SendMessage from '../form/SendMessage';
import css from './Messages.module.css';

export default function Messages({
     chat,
  setUser,
}: {
     chat: Chat;
  setUser: Auth['setUser'];
}) {
  return (
    <>
      <ul className={css['messages']}>
        <li>Message</li>
      </ul>
      <SendMessage {...{ url: '', setUser }} />
    </>
  );
}
