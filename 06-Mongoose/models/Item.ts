import { Model, model, Types, Schema } from 'mongoose';

const required = true;

interface IItem {
    name: string;
    desc: string;
  imgURL: string;
   price: number;
  userId: Types.ObjectId;
}

interface IItemMethods {
  // to be continued...
}

type ItemModel = Model<IItem, {}, IItemMethods>;

const itemSchema = new Schema<IItem, ItemModel, IItemMethods>({
  name: {
    type: String,
    required,
  },
  desc: {
    type: String,
    required,
  },
  imgURL: {
    type: String,
    required,
  },
  price: {
    type: Number,
    required,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required,
  },
});

export default model<IItem, ItemModel>('Item', itemSchema);
