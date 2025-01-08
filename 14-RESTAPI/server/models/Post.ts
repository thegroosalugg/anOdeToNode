import { Model, model, Types, Schema } from 'mongoose';

const required = true;

export interface IPost {
    title: string;
  content: string;
   imgURL: string;
   author: Types.ObjectId;
}

interface IPostMethods {
  // to be continued...
}

type PostModel = Model<IPost, {}, IPostMethods>;

export const postSchema = new Schema<IPost, PostModel, IPostMethods>({
    title: { type: String, required },
  content: { type: String, required },
   imgURL: { type: String },
   author: { type: Schema.Types.ObjectId, ref: 'User', required },
  },
  { timestamps: true }
);

export default model<IPost, PostModel>('Post', postSchema);
