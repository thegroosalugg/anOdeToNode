import Chat from "@/models/Chat";
import Friend from "@/models/Friend";
import { useChat } from "./ChatContext";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/http/endpoints";

export const useChatParamsSync = () => {
  const {
    user,
    chats,
    reqChats,
    isInitial,
    isOpen,
    setIsOpen,
    setActiveChat,
    destroyURL,
    deferring,
  } = useChat();
  const [searchParams] = useSearchParams();
  const       peerId = searchParams.get("chat");
  const lastChatsRef = useRef(0);

  useEffect(() => {
    reqChats({ url: api.chat.all });
  }, [reqChats]);

  useEffect(() => {
    if (!peerId || isInitial) return;

    // delete URL if user tries to open menu via new message as soon as close triggered
    if (deferring && !isOpen) {
      destroyURL();
      return;
    }

    // Check if chats array got shorter (deletion)
    const chatsDecreased = chats.length < lastChatsRef.current;

    lastChatsRef.current = chats.length;
    if (chatsDecreased) return;

    let chat = chats.find(({ guest, host }) => [host._id, guest._id].includes(peerId));
    if (!chat) {
      const peer = user.friends.find((friend) => Friend.getId(friend) === peerId)?.user;
      if (!peer || !Friend.isUser(peer)) return;
      chat = new Chat(user, peer);
    }
    // !chat = new Chat(dummy) => send 1st msg => socket updates chats & retriggers this effect
    // this time chat is found, and if it replaces prev, it changes ID and causes dismount
    // therefore, if chat is temp, prev state is preserved instead
    setActiveChat((prev) => (prev?.isTemp ? prev : chat));
    setIsOpen(true);
  }, [peerId, deferring, user, chats, isOpen, isInitial, setIsOpen, setActiveChat, destroyURL]);
};
