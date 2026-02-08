import { Meta } from "@/lib/types/common";
import { UserPair } from "@/lib/types/interface";
import User from "./User";

interface UserPairExt extends UserPair {
  watcher: User; // remove optional here
}

export default class Friend {
         _id!: string;
   createdAt!: string;
  acceptedAt!: string;
    accepted!: boolean;
   initiated!: boolean;
        user!: User | string;
        meta!: Meta;

  static isUser = (user: Friend["user"]): user is User =>
    typeof user === "object" && user !== null && "_id" in user;

  static getId = (friend: { _id: string; user?: Friend["user"] }): string => {
    const { user = "" } = friend;
    return Friend.isUser(user) ? user._id : user;
  };

  static getConnection = ({ target, watcher } : UserPairExt) =>
    target.friends.find((friend) => Friend.getId(friend) === watcher._id);

  static getMutuals = ({ target, watcher } : UserPairExt) =>
    target.friends.filter(
      (their) =>
        Friend.getId(their) !== watcher._id &&
        watcher.friends.some(
          (your) =>
            Friend.getId(your) === Friend.getId(their) && your.accepted && their.accepted
        )
    );
}
