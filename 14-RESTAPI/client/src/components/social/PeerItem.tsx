import User from "@/models/User";
import ProfilePic from "../ui/image/ProfilePic";

export default function PeerItem({ user, count }: { user: User; count: number }) {
  const { name, surname } = user;
  return (
    <>
      <ProfilePic {...{ user }} />
      <h2 className="truncate">
        {name} {surname}
      </h2>
      {count > 0 && <p>{count} mutual friends</p>}
    </>
  );
}
