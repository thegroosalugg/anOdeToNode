import Chat from "@/models/Chat";
import { useChat } from "./ChatContext";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export const useChatParamsSync = () => {
  const { user, chats, setIsOpen, setActiveChat, reqChats } = useChat();
  const [searchParams] = useSearchParams();
  const peerId = searchParams.get("chat");
  const hasLoaded = useRef(false);

  useEffect(() => {
    const initData = async () => {
      await reqChats({ url: "chat/all" });
      hasLoaded.current = true;
    };

    initData();
  }, [reqChats]);

  useEffect(() => {
    if (!peerId || !hasLoaded.current) return;
    let chat = chats.find(({ guest, host }) => [host._id, guest._id].includes(peerId));
    if (!chat) {
      const peer = user.friends.find(({ user }) => user._id === peerId)?.user;
      if (peer) chat = new Chat(user, peer);
    }
    if (chat) {
      setActiveChat((prev) => (prev?.isTemp ? prev : chat));
      setIsOpen(true);
    }
  }, [peerId, user, chats, setIsOpen, setActiveChat]);
};
