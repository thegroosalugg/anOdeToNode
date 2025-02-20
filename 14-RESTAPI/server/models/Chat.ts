import { Model, model, Types, Schema } from 'mongoose';
import { IMsg, msgSchema } from './Msg';

interface IChat {
        host: Types.ObjectId;
       guest: Types.ObjectId;
  deletedFor: Map<string, boolean>;
      alerts: Map<string,  number>;
     lastMsg: IMsg;
        temp: boolean;
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
    deletedFor: { type: Map, of: Boolean, default: {}    },
        alerts: { type: Map, of: Number,  default: {}    },
          temp: { type: Boolean,          default: false },
       lastMsg: msgSchema,
  },
  { timestamps: true }
);

export default model<IChat, ChatModel>('Chat', chatSchema);
