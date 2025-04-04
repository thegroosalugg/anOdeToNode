import { Model, model, Types, Schema } from 'mongoose';
import Item, { IItem } from './Item';
import errorMsg from '../util/errorMsg';

const required = true;
const trim = true;
const validate = {
  validator: (value: string) => value.trim().length > 0,
    message: '', // this message will never show as 'required' will display first
};

interface IUser {
        name: string;
       email: string;
    password: string;
  resetAuth?: { token: string, expiry: number };
        cart: { itemId: Types.ObjectId | string; quantity: number }[];
}

interface IUserMethods {
  updateCart: (_id: string, quantity: 1 | -1) => Promise<void>;
     getCart: () => Promise<IItem[]>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
       name: { type: String, required, trim, validate },
      email: { type: String, required, trim, validate, unique: true },
   password: { type: String, required }, // handled manually
  resetAuth: {
     token: { type: String },
    expiry: { type: Number },
  },
       cart: [
     {
         itemId: { type: Schema.Types.ObjectId, ref: 'Item', required },
       quantity: { type: Number,                min: 1,      required },
     },
   ],
});

userSchema.methods.updateCart = async function(_id, quantity) {
  const index = this.cart.findIndex(({ itemId }) => itemId.toString() === _id);

  if (index !== -1) {
    this.cart[index].quantity += quantity;

    if (this.cart[index].quantity <= 0) {
      this.cart.splice(index, 1);
    }
  } else if (quantity === 1) {
    // mongoose will convert to ObjectId
    this.cart = [{ itemId: _id, quantity: 1 }, ...this.cart];
  }

  try {
    await this.save(); // mongoose function
  } catch (error) {
    errorMsg({ error, where: 'userSchema updateCart'});
  }
};

userSchema.methods.getCart = async function() {
  const cartIds = this.cart.map(({ itemId }) => itemId);

  try {
    const items = await Item.find({ _id: { $in: cartIds } })
      .populate('userId', 'name')
      .lean(); // lean returns plain JS objects

    const  cartItems:  IItem[] = [];
    const deletedIds: string[] = [];

    for (const { itemId, quantity } of this.cart) {
      const index = items.findIndex(({ _id }) => _id.toString() === itemId.toString());
      if (index !== -1) {
        cartItems.push({ ...items[index], quantity });
      } else {
        deletedIds.push(itemId.toString());
      }
    }

    // remove deleted items by other users from current user's cart and update
    this.cart = this.cart.filter(({ itemId }) => !deletedIds.includes(itemId.toString()));
    await this.save();
    return cartItems;
  } catch (error) {
    errorMsg({ error, where: 'userSchema getCart'});
    return [];
  }
};

export default model<IUser, UserModel>('User', userSchema);
