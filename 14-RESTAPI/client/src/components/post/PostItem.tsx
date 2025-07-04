import Post from "@/models/Post";
import ProfilePic from "../ui/image/ProfilePic";
import { timeAgo } from "@/lib/util/timeStamps";
import { ReactNode } from "react";
import css from "./PostItem.module.css";

const Truncate = ({ children }: { children: ReactNode }) => (
  <span className="truncate">{children}</span>
);

export default function PostItem({
    creator,
      title,
  updatedAt,
    content,
  isCreator,
}: Post & { isCreator?: boolean }) {
  const { name = "account", surname = "deleted" } = creator;
  return (
    <article className={`${css["post"]} floating-box`}>
      {!isCreator && (
        <h1>
          <ProfilePic user={creator} />
          <Truncate>
            {name} {surname}
          </Truncate>
        </h1>
      )}
      <h2>
        <Truncate>{title}</Truncate>
        <Truncate>{timeAgo(updatedAt)}</Truncate>
      </h2>
      <p className="line-clamp">{content}</p>
    </article>
  );
}
