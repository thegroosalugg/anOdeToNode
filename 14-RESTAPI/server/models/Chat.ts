import { Model, model, Types, Schema } from 'mongoose';
import Msg, { IMsg, msgSchema } from './Msg';
import captainsLog from '../util/captainsLog';

interface IChat {
        host: Types.ObjectId;
       guest: Types.ObjectId;
  deletedFor: Map<string, boolean>;
      alerts: Map<string,  number>;
     lastMsg: IMsg;
      isTemp: boolean;
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
        isTemp: { type: Boolean,          default: false },
       lastMsg: msgSchema,
  },
  { timestamps: true }
);

chatSchema.pre('updateMany', { document: false, query: true }, async function () {
  const  chats = this.getFilter()._id.$in;
  const userId = this.getOptions().userId; // Access userId from options

  const result = await Msg.updateMany(
    { chat: { $in: chats } },
    { $set: { [`deletedFor.${userId}`]: true } }
  );
  captainsLog(200, { msgUpdateMany: result })
});

chatSchema.pre('deleteMany', { document: false, query: true }, async function () {
  const chats = this.getFilter()._id.$in;
  const result = await Msg.deleteMany({ chat: { $in: chats } });
  captainsLog(200, { msgDeleteMany: result })
});

export default model<IChat, ChatModel>('Chat', chatSchema);
