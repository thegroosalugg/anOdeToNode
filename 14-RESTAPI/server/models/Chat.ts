import { Model, model, Types, Schema } from 'mongoose';

interface IChat {
   host: Types.ObjectId;
  guest: Types.ObjectId;
}

interface IChatMethods {
  // to be continued...
}

type ChatModel = Model<IChat, {}, IChatMethods>;

export const chatSchema = new Schema<IChat, ChatModel, IChatMethods>(
  {
     host: { type: Schema.Types.ObjectId, ref: 'User' },
    guest: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default model<IChat, ChatModel>('Chat', chatSchema);
