import { Meta } from "@/lib/types/common";
import { UserPair } from "@/lib/types/interface";
import User from "./User";

export default class Friend {
         _id!: string;
   createdAt!: string;
  acceptedAt!: string;
    accepted!: boolean;
   initiated!: boolean;
        user!: User | string;
        meta!: Meta;

  static getId = (friend: { _id: string; user?: Friend["user"] }): string => {
    const { user = "" } = friend;
    return typeof user === "object" && "_id" in user ? user._id : user;
  };

  static getConnection = ({ target, watcher } : UserPair) =>
    target.friends.find((friend) => Friend.getId(friend) === watcher._id);

  static getMutuals = ({ target, watcher } : UserPair) =>
    target.friends.filter(
      (their) =>
        Friend.getId(their) !== watcher._id &&
        watcher.friends.some(
          (your) =>
            Friend.getId(your) === Friend.getId(their) && your.accepted && their.accepted
        )
    );

  static getAlertsByType = ({ user, hasSent = false }: { user: User; hasSent?: boolean }) =>
    user.friends
      .filter(({ initiated, meta }) => {
        return (hasSent ? initiated : !initiated) && meta.show;
      })
      .reverse();
}
