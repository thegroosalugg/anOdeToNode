import { Model, model, Types, Schema } from 'mongoose';
import { IItem, itemSchema } from './Item';

const required = true;

interface IOrder {
    user: { _id: Types.ObjectId, name: string, email: string };
   items: IItem[];
}

interface IOrderMethods {
  // to be continued...
}

type OrderModel = Model<IOrder, {}, IOrderMethods>;

const OrderSchema = new Schema<IOrder, OrderModel, IOrderMethods>({
  user: {
      _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
     name: { type: String, required },
    email: { type: String, required, unique: true },
  },
  items: [
    {
      ...itemSchema.obj,
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

export default model<IOrder, OrderModel>('Order', OrderSchema);
