import Chat from "@/models/Chat";
import { useChat } from "./ChatContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useChatParamsSync = () => {
  const { user, chats, isOpen, setIsOpen, setActiveChat } = useChat();
  const [searchParams] = useSearchParams();
  const peerId = searchParams.get("chat");

  useEffect(() => {
    if (peerId) {
      let chat = chats.find(({ guest, host }) => [host._id, guest._id].includes(peerId));
      if (!chat) {
        const peer = user.friends.find(({ user }) => user._id === peerId)?.user;
        if (peer) chat = new Chat(user, peer);
      }
      if (chat) {
        setActiveChat(chat);
        setIsOpen(true);
      }
    }
  }, [user, peerId, chats, isOpen, setActiveChat, setIsOpen]);
};
