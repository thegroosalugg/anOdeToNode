import User from "@/models/User";
import ProfilePic from "../../ui/image/ProfilePic";
import Friend from "@/models/Friend";
import css from "./UserItem.module.css";

// user = the one being viewed | peer = the comparison filter
export default function UserItem({ target, watcher }: { target: User; watcher: User }) {
  const { name, surname, friends } = target;

  const count = watcher.friends.filter((your) =>
    friends.some(
      (their) =>
        Friend.getId(your) === Friend.getId(their) && your.accepted && their.accepted
    )
  ).length;

  return (
    <article className={css["user-item"]}>
      <ProfilePic user={target} />
      <h2 className="truncate">
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
