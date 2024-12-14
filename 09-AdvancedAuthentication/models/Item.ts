import { Model, model, Types, Schema } from 'mongoose';

const required = true;

export interface IItem {
      name: string;
      desc: string;
    imgURL: string;
     price: number;
  quantity: number;
    userId: Types.ObjectId;
}

interface IItemMethods {
  // to be continued...
}

type ItemModel = Model<IItem, {}, IItemMethods>;

export const itemSchema = new Schema<IItem, ItemModel, IItemMethods>({
    name: { type: String, required },
    desc: { type: String, required },
  imgURL: { type: String, required },
   price: { type: Number, required },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required },
});

export default model<IItem, ItemModel>('Item', itemSchema);
