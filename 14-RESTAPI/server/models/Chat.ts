import { Model, model, Types, Schema } from 'mongoose';
import { IMsg, msgSchema } from './Msg';

interface IChat {
        host: Types.ObjectId;
       guest: Types.ObjectId;
  deletedFor: Types.ObjectId[];
     lastMsg: IMsg;
}

interface IChatMethods {
  // to be continued...
}

type ChatModel = Model<IChat, {}, IChatMethods>;

const user = { type: Schema.Types.ObjectId, ref: 'User' };

export const chatSchema = new Schema<IChat, ChatModel, IChatMethods>(
  {
          host:  user,
         guest:  user,
    deletedFor: [user],
       lastMsg: msgSchema,
  },
  { timestamps: true }
);

export default model<IChat, ChatModel>('Chat', chatSchema);
