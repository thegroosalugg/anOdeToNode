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

export default function UserProfile({ user, setUser }: UserState) {
  const { fetcher: { isLoading, error }, ...rest } = usePagedFetch<Post>(api.profile.posts, 4);
  const align = "end";

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
               title: { text: "Your Posts",                  align },
            fallback: { text: "You haven't posted anything", align },
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
