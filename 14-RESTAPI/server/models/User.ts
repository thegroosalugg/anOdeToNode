import { Model, model, Types, Schema } from 'mongoose';

const required = true;

export interface IFriend {
       _id: Types.ObjectId;
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
  // TBC
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

export default model<IUser, UserModel>('User', userSchema);
