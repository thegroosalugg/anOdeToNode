import { Model, model, Types, Schema } from 'mongoose';

const required = true;

export interface IReply {
  content: string;
  creator: Types.ObjectId;
     post: Types.ObjectId;
}

interface IReplyMethods {
  // to be continued...
}

type ReplyModel = Model<IReply, {}, IReplyMethods>;

export const replySchema = new Schema<IReply, ReplyModel, IReplyMethods>({
  content: { type: String, required },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required },
     post: { type: Schema.Types.ObjectId, ref: 'Post', required },
  },
  { timestamps: true }
);

export default model<IReply, ReplyModel>('Reply', replySchema);
