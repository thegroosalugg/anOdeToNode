import { Model, model, Types, Schema } from 'mongoose';

const required = true;

interface IUser {
        name: string;
     surname: string;
       email: string;
    password: string;
      imgURL: string;
}

interface IUserMethods {
  // TBC
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
       name: { type: String, required },
    surname: { type: String, required },
      email: { type: String, required, unique: true },
   password: { type: String, required },
     imgURL: { type: String },
});

export default model<IUser, UserModel>('User', userSchema);
