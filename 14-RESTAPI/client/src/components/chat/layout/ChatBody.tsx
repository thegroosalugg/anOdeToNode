import { useChat } from "../context/ChatContext";
import AsyncAwait from "../../ui/boundary/AsyncAwait";
import ChatActions from "./actions/ChatActions";
import ChatList from "./list/ChatList";
import Heading from "@/components/ui/layout/Heading";
import css from "./ChatBody.module.css";

export default function ChatBody() {
  const { isLoading, error, chats, activeChat } = useChat();

  return (
    <div className={css["chat-body"]}>
      <ChatActions />
      <AsyncAwait {...{ isLoading, error }}>
        {!chats.length && !activeChat ? (
          <Heading className={css["fallback"]}>
            You haven't started any chats
          </Heading>
        ) : (
          <ChatList />
        )}
      </AsyncAwait>
    </div>
  );
}
