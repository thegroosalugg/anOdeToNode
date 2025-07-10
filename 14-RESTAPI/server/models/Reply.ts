import { Model, model, Types, Schema } from 'mongoose';
import { IPost } from './Post';
import { IUser } from './User';

const required = true;

export interface IReply {
  content: string;
  creator: Types.ObjectId | IUser;
     post: Types.ObjectId | IPost;
     meta: { read: boolean; show: boolean };
}

interface IReplyMethods {
  // to be continued...
}

type ReplyModel = Model<IReply, {}, IReplyMethods>;

export const replySchema = new Schema<IReply, ReplyModel, IReplyMethods>({
  content: { type: String, required },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required },
     post: { type: Schema.Types.ObjectId, ref: 'Post', required },
     meta: {
      read: { type: Boolean, default: false },
      show: { type: Boolean, default: true  },
    }
  },
  { timestamps: true }
);

export default model<IReply, ReplyModel>('Reply', replySchema);
