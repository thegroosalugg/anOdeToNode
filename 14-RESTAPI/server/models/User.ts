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
      name: string;
   surname: string;
     email: string;
  password: string;
    imgURL: string;
   friends: IFriend[];
     about: IProfile;
}

interface IUserMethods {
  isFriend: (userId: string | Types.ObjectId) => boolean;
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

userSchema.methods.isFriend = function (peerId: string | Types.ObjectId) {
  if (!Types.ObjectId.isValid(peerId)) return false;
  return this.friends.some(({ user, accepted }) => user.equals(peerId) && accepted);
};

export default model<IUser, UserModel>('User', userSchema);
