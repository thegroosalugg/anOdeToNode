import { motion } from "motion/react";
import { useState } from "react";
import { usePagedFetch } from "../pagination/usePagedFetch";
import { Authorized } from "@/lib/types/auth";
import Post from "@/models/Post";
import ProfileHeader from "./ProfileHeader";
import Button from "../ui/button/Button";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import AsyncAwait from "../ui/boundary/AsyncAwait";
import FriendsList from "../list/user/FriendsList";
import PagedList from "../pagination/PagedList";
import PostItem from "../list/post/PostItem";
import css from "./UserProfile.module.css";

export default function UserProfile({ user, setUser }: Authorized) {
  const {
    fetcher: { isLoading, error },
    ...rest
  } = usePagedFetch<Post>("profile/posts", 4);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  function logout() {
    closeModal();
    setUser(null);
    localStorage.removeItem("jwt-access");
    localStorage.removeItem("jwt-refresh");
  }

  return (
    <>
      <ConfirmDialog open={showModal} onConfirm={logout} onCancel={closeModal} />
      <motion.div
        className={css["user-profile"]}
             exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <ProfileHeader {...{ user, setUser }} />
        <FriendsList target={user} />
        <AsyncAwait {...{ isLoading, error }}>
          <PagedList<Post>
              path="post"
            header={{
                 title: ["Your Posts",                  "end"],
              fallback: ["You haven't posted anything", "end"],
            }}
            {...rest}
          >
            {(post) => <PostItem {...post} isCreator />}
          </PagedList>
        </AsyncAwait>
        <Button
             onClick={() => setShowModal(true)}
          background="var(--error)"
          animations={{ transition: { opacity: { delay: 1.8 } } }}
        >
          Logout
        </Button>
      </motion.div>
    </>
  );
}
