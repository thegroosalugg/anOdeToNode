import Post from "@/models/Post";
import NameTag from "../../ui/tags/NameTag";
import Time from "../../ui/tags/Time";
import css from "./PostItem.module.css";

export default function PostItem({
    creator,
      title,
  updatedAt,
    content,
  isCreator,
}: Post & { isCreator?: boolean }) {
  return (
    <article className={`${css["post"]} box`}>
      {!isCreator && <NameTag user={creator} align="start" />}
      <header>
        <strong className="truncate">{title}</strong>
        <Time time={updatedAt} />
      </header>
      <hr />
      <p className="line-clamp">{content}</p>
    </article>
  );
}
