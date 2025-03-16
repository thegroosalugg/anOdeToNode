import { Model, model, Types, Schema } from 'mongoose';

// centralised filter for search queries
export const _public = '-email -password';

const required = true;

export interface IUser {
      name: string;
     email: string;
  password: string;
}

interface IUserMethods {
  isFriend: (userId: string | Types.ObjectId) => boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
        name: { type: String, required },
       email: { type: String, required, unique: true },
    password: { type: String, required },
  },
  { timestamps: true }
);

export default model<IUser, UserModel>('User', userSchema);
