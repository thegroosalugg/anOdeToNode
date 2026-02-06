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
    isOpen,
    setIsOpen,
    setActiveChat,
    destroyURL,
    deferring,
  } = useChat();
  const [searchParams] = useSearchParams();
  const       peerId = searchParams.get("chat");
  const    hasLoaded = useRef(false);
  const lastChatsRef = useRef(0);

  useEffect(() => {
    const initData = async () => {
      await reqChats({ url: api.chat.all });
      hasLoaded.current = true;
    };

    initData();
  }, [reqChats]);

  useEffect(() => {
    if (!peerId || !hasLoaded.current) return;

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
      if (typeof peer === "string") return;
      if (peer) chat = new Chat(user, peer);
    }
    // !chat = new Chat(dummy) => send 1st msg => socket updates chats & retriggers this effect
    // this time chat is found, and if it replaces prev, it changes ID and causes dismount
    // therefore, if chat is temp, prev state is preserved instead
    if (chat) {
      setActiveChat((prev) => (prev?.isTemp ? prev : chat));
      setIsOpen(true);
    }
  }, [peerId, deferring, user, chats, isOpen, setIsOpen, setActiveChat, destroyURL]);
};
