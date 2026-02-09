import { Model, model, Types, Schema } from 'mongoose';

// centralised filter for search queries
export const _full    = '-email -password';
export const _friends = _full + ' -about';
export const _basic   = _friends + ' -friends';

const required = true;

export interface IFriend {
         _id: Types.ObjectId;
   createdAt: Date;
  acceptedAt: Date;
    accepted: boolean;
   initiated: boolean;
        user: Types.ObjectId;
        meta: { read: boolean; show: boolean };
}

export interface IProfile {
   home?: string;
   work?: string;
  study?: string;
    bio?: string;
}

export interface IUser {
       _id: Types.ObjectId;
      name: string;
   surname: string;
     email: string;
  password: string;
    imgURL: string;
   friends: IFriend[];
     about: IProfile;
}

export type FriendAction = 'add' | 'accept' | 'delete';

interface IUserMethods {
  isFriend: (userId: string | Types.ObjectId) => boolean;
   request: (peer: IUser, action: FriendAction) => Record<string, unknown> | void;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
        name: { type: String, required },
     surname: { type: String, required },
       email: { type: String, required, unique: true },
    password: { type: String, required },
      imgURL: { type: String },
     friends: [
        {
           user: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date,      default: Date.now },
     acceptedAt: { type: Date },
       accepted: { type: Boolean,   default: false    },
      initiated: { type: Boolean, immutable: true     },
           meta: {
             read: { type: Boolean, default: false },
             show: { type: Boolean, default: true  },
           }
         },
      ],
       about: {
          home: { type: String },
          work: { type: String },
         study: { type: String },
           bio: { type: String },
       },
    },
  { timestamps: true }
);

userSchema.methods.isFriend = function (peerId) {
  if (!Types.ObjectId.isValid(peerId)) return false;
  return this.friends.some(({ user, accepted }) => user.equals(peerId) && accepted);
};

const findUserIndex = (user: IUser, peer: IUser) =>
  user.friends.findIndex((friend: IFriend) => friend.user.equals(peer._id));

const addFriend = (user: IUser, peer: IUser, initiated: { initiated: boolean }) => {
  user.friends.push({ user: peer._id, ...initiated } as IFriend);
};

const acceptFriend = (friend: IFriend, date: Date) => {
  friend.accepted   = true;
  friend.acceptedAt = date;
};

const deleteFriend = (target: IUser, index: number) => {
  target.friends.splice(index, 1);
};

userSchema.methods.request = function (peer, action) {
  const user = this;
  const peerIndex = findUserIndex(peer, user);
  const userIndex = findUserIndex(user, peer);

  let peerFriend = peer.friends[peerIndex];
  let userFriend = user.friends[userIndex];

  const date = new Date();
  const error = { action, userFriend, peerFriend }; // passed to logger

  switch (action) {
    case 'add':
      const bothExist     = !!userFriend && !!peerFriend;
      const bothAccepted  = bothExist && userFriend.accepted && peerFriend.accepted;
      const oneAccepted   = bothExist && userFriend.accepted !== peerFriend.accepted;
      const peerDuplicate = !userFriend && peerFriend;
      const userDuplicate = userFriend && !peerFriend;
      if (bothAccepted) return error;
      if (peerDuplicate || userDuplicate) {
        const [target, index] = peerDuplicate ? [peer, peerIndex] : [user, userIndex];
        deleteFriend(target, index); // patch corrupted connection
        return error;
      }
      if (oneAccepted) {
        const target = userFriend.accepted ? peerFriend : userFriend;
        acceptFriend(target, date); // patch unsynced
        return error;
      }
      addFriend(user, peer, { initiated: true  });
      addFriend(peer, user, { initiated: false });
      break;
    case 'accept':
      const isInvalid = !userFriend || !peerFriend || !peerFriend.initiated || userFriend.accepted || peerFriend.accepted;
      if (isInvalid) return error;
      acceptFriend(userFriend, date);
      acceptFriend(peerFriend, date);
      break;
    case 'delete':
      if (userIndex !== -1) deleteFriend(user, userIndex);
      if (peerIndex !== -1) deleteFriend(peer, peerIndex);
      break;
  }
};

export default model<IUser, UserModel>('User', userSchema);
