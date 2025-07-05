import { formatDate } from "@/lib/util/timeStamps";
import User from "@/models/User";
import InfoTag from "@/components/ui/tags/InfoTag";
import css from "./UserAbout.module.css";

export default function UserAbout({
        user,
  acceptedAt,
}: {
         user: User;
  acceptedAt?: string;
}) {
  const { createdAt, about } = user;
  const { bio, home, study, work } = about ?? {};

  return (
    <section className={css["user-about"]}>
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
