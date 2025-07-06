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

  static getConnection = (user: User, peer: User) =>
    user.friends.find((friend) => Friend.getId(friend) === peer._id);
}
