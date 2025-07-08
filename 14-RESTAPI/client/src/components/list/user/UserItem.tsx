import { UserPair } from "@/lib/types/interface";
import Friend from "@/models/Friend";
import ProfilePic from "../../ui/image/ProfilePic";
import css from "./UserItem.module.css";

interface UserItem extends UserPair {
  className?: string;
       font?: "truncate" | "line-clamp";
}

// user = the one being viewed | peer = the comparison filter
export default function UserItem({
     target,
    watcher,
  className = "",
       font = "truncate",
}: UserItem) {
  const { name, surname } = target;

  let count = 0;
  if (watcher) count = Friend.getMutuals({ target, watcher }).length;

  return (
    <article className={`${css["user-item"]} ${className}`}>
      <ProfilePic user={target} />
      <h2 className={font}>
        {name} {surname}
      </h2>
      {count > 0 && (
        <p>
          {count} mutual friend{count > 1 ? "s" : ""}
        </p>
      )}
    </article>
  );
}
