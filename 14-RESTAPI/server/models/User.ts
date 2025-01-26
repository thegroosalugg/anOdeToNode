import { Model, model, Types, Schema } from 'mongoose';

const required = true;

interface IFriend {
  status: 'sent' | 'received' | 'accepted';
    user: Types.ObjectId;
   meta?: {
     read: boolean;
     show: boolean;
  };
}

interface IUser {
      name: string;
   surname: string;
     email: string;
  password: string;
    imgURL: string;
   friends: IFriend[];
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
     createdAt: { type: Date,    default: Date.now },
        status: { type: String,  enum: ['sent', 'received', 'accepted'] },
     // enum is a type validator that restricts values to a predefined set
          meta: {
            read: { type: Boolean, default: false },
            show: { type: Boolean, default: true  },
          }
        },
      ],
    },
  { timestamps: true }
);

export default model<IUser, UserModel>('User', userSchema);
