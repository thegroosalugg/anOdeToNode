import { useNavigate } from "react-router-dom";
import { UserPair } from "@/lib/types/interface";
import Friend from "@/models/Friend";
import ProfilePic from "../../ui/image/ProfilePic";
import css from "./UserItem.module.css";

interface UserItem extends UserPair {
  className?: string;
   overflow?: "truncate" | "line-clamp";
}

// user = the one being viewed | peer = the comparison filter
export default function UserItem({
     target,
    watcher,
  className = "",
   overflow = "truncate",
}: UserItem) {
  const navigate = useNavigate();
  const { _id, name, surname } = target;

  let count = 0;
  if (watcher) count = Friend.getMutuals({ target, watcher }).length;

  return (
    <article className={`${css["user-item"]} ${className}`} onClick={() => navigate("/user/" + _id)}>
      <ProfilePic user={target} />
      <h2 className={overflow}>
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
