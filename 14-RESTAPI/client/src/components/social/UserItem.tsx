import User from "@/models/User";
import ProfilePic from "../profile/ProfilePic";

export default function UserItem({ user }: { user: User } ) {
  const { name, surname } = user;
  return <>
    <h2>{name} {surname}</h2>
    <ProfilePic user={user} />
  </>
};
