import { formatDate } from "@/lib/util/timeStamps";
import InfoTag from "@/components/ui/tags/InfoTag";
import css from "./UserAbout.module.css";
import { UserPair } from "@/lib/types/interface";

export default function UserAbout({
      target,
     watcher,
  acceptedAt,
}: UserPair & {
  acceptedAt?: string;
}) {
  const { createdAt, about } = target;
  const { bio, home, study, work } = about ?? {};
  let classes = css["user-about"];
  if (!watcher || acceptedAt) classes +=  " floating-box";

  return (
    <section className={classes}>
      <h2>
        Joined on <strong>{formatDate(createdAt, ["year"])}</strong>
      </h2>
      {acceptedAt && (
        <h2>
          You have been friends since<strong> {formatDate(acceptedAt, ["year"])}</strong>
        </h2>
      )}
      <InfoTag icon="house" text="Lives in">
        {home}
      </InfoTag>
      <InfoTag icon="briefcase" text="Works at">
        {work}
      </InfoTag>
      <InfoTag icon="book" text="Studied at">
        {study}
      </InfoTag>
      <InfoTag icon="comment-dots">{bio}</InfoTag>
    </section>
  );
}
