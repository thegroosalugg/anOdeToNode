import { Model, model, Types, Schema } from 'mongoose';
import { IItem, itemSchema } from './Item';

const required = true;

interface IOrder {
       user: { _id: Types.ObjectId, name: string, email: string };
      items: IItem[];
  createdAt: Date;
}

interface IOrderMethods {
  // to be continued...
}

type OrderModel = Model<IOrder, {}, IOrderMethods>;

const OrderSchema = new Schema<IOrder, OrderModel, IOrderMethods>({
  createdAt: { type: Date, default: Date.now },
  user: {
      _id: { type: Schema.Types.ObjectId, ref: 'User', required },
     name: { type: String, required },
    email: { type: String, required },
  },
  items: [
    {
      ...itemSchema.obj,
      quantity: { type: Number, required, min: 1 },
    },
  ],
});

export default model<IOrder, OrderModel>('Order', OrderSchema);
