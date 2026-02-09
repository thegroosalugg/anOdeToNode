import { motion } from "motion/react";
import { usePagedFetch } from "../pagination/usePagedFetch";
import { UserState } from "@/lib/types/interface";
import Post from "@/models/Post";
import UserDashboard from "./dashboard/UserDashboard";
import AsyncAwait from "../ui/boundary/AsyncAwait";
import FriendsList from "../list/user/FriendsList";
import PagedList from "../pagination/PagedList";
import PostItem from "../list/post/PostItem";
import UserLogout from "./actions/user/UserLogout";
import ProfileActions from "./actions/user/ProfileActions";
import { api } from "@/lib/http/endpoints";
import css from "./UserProfile.module.css";

export default function UserProfile({ user, setUser }: UserState) {
  const { isLoading, error, ...rest } = usePagedFetch<Post>(api.profile.posts, 4);
  const    align = "end" as const;
  const    title = { text: "Your Posts",                  align };
  const fallback = { text: "You haven't posted anything", align };

  return (
    <motion.div className={css["user-profile"]} exit={{ opacity: 0, transition: { duration: 0.8 } }}>
      <UserDashboard target={user}>
        <ProfileActions {...{ user, setUser }} />
      </UserDashboard>
      <FriendsList target={user} />
      <AsyncAwait {...{ isLoading, error }}>
        <PagedList<Post> header={{ title, fallback }} {...rest}>
          {(post) => <PostItem {...post} isCreator />}
        </PagedList>
      </AsyncAwait>
      <UserLogout {...{ setUser }} />
    </motion.div>
  );
}
