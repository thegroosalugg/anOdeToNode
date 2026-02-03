import { Model, model, Types, Schema } from 'mongoose';
import Reply from './Reply';
import { IUser } from './User';
import captainsLog from '../util/captainsLog';

const required = true;

export interface IPost {
      _id: Types.ObjectId;
    title: string;
  content: string;
   imgURL: string;
  creator: Types.ObjectId | IUser;
}

interface IPostMethods {
  // to be continued...
}

type PostModel = Model<IPost, {}, IPostMethods>;

export const postSchema = new Schema<IPost, PostModel, IPostMethods>({
    title: { type: String, required },
  content: { type: String, required },
   imgURL: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required },
  },
  { timestamps: true }
);

postSchema.pre('deleteOne', { document: false, query: true }, async function() {
  const post = this.getFilter()._id;
  const result = await Reply.deleteMany({ post }); // deletes all replies with this post ID
  captainsLog(200, { replyDeleteMany: result })
});

export default model<IPost, PostModel>('Post', postSchema);
