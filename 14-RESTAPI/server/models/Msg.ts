import { Model, model, Types, Schema } from 'mongoose';

export interface IMsg {
     chat: Types.ObjectId;
   sender: Types.ObjectId;
  content: string;
}

interface IMsgMethods {
  // to be continued...
}

type MsgModel = Model<IMsg, {}, IMsgMethods>;

export const msgSchema = new Schema<IMsg>(
  {
       chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
     sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IMsg, MsgModel>('Msg', msgSchema);
