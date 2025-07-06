import { usePagedFetch } from "../pagination/usePagedFetch";
import { Authorized } from "@/lib/types/auth";
import Post from "@/models/Post";
import UserDashboard from "./dashboard/UserDashboard";
import AsyncAwait from "../ui/boundary/AsyncAwait";
import FriendsList from "../list/user/FriendsList";
import PagedList from "../pagination/PagedList";
import PostItem from "../list/post/PostItem";
import UserLogout from "./actions/user/UserLogout";
import ProfileActions from "./actions/user/ProfileActions";

export default function UserProfile({ user, setUser }: Authorized) {
  const { fetcher: { isLoading, error }, ...rest } = usePagedFetch<Post>("profile/posts", 4);

  return (
    <>
      <UserDashboard target={user}>
        <ProfileActions {...{ user, setUser }} />
      </UserDashboard>
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
      <UserLogout {...{ setUser }} />
    </>
  );
}
