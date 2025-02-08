import { Model, model, Types, Schema } from 'mongoose';

interface IChat {
        user: Types.ObjectId;
        peer: Types.ObjectId;
  deletedFor: Types.ObjectId[];
}

interface IChatMethods {
  // to be continued...
}

type ChatModel = Model<IChat, {}, IChatMethods>;

const user = { type: Schema.Types.ObjectId, ref: 'User' };

export const chatSchema = new Schema<IChat, ChatModel, IChatMethods>(
  { user, peer: user, deletedFor: [user] },
  { timestamps: true }
);

export default model<IChat, ChatModel>('Chat', chatSchema);
