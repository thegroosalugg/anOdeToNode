import { Model, model, Types, Schema } from 'mongoose';

const required = true;

export interface IUser {
      name: string;
     email: string;
  password: string;
    imgURL: string;
}

interface IUserMethods {
  // TBD
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
        name: { type: String, required },
       email: { type: String, required, unique: true },
    password: { type: String, required },
      imgURL: { type: String },
  },
  { timestamps: true }
);

export default model<IUser, UserModel>('User', userSchema);
