import { Meta } from "@/lib/types/common";
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

  static getConnection = (target: User, watcher: User) =>
    target.friends.find((friend) => Friend.getId(friend) === watcher._id);

  static getMutuals = (target: User, watcher: User) =>
    target.friends.filter(
      (their) =>
        Friend.getId(their) !== watcher._id &&
        watcher.friends.some(
          (your) =>
            Friend.getId(your) === Friend.getId(their) && your.accepted && their.accepted
        )
    );
}
