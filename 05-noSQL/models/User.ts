import { ObjectId } from 'mongodb';
import { getDb } from '../data/database';

type CartItem = { itemId: ObjectId; quantity: number };

export default class User {
   _id?: ObjectId; // taken care of by Mongo. Explicitly added to handle server requests
   name: string;
  email: string;
   cart: CartItem[];

   constructor({
     name,
    email,
     cart,
      _id,
  }: {
     name: string;
    email: string;
    cart?: CartItem[];
     _id?: ObjectId;
  }) {
    this.name  = name;
    this.email = email;
    this.cart  = cart || [];
    if (_id) this._id = _id;
  }

  async save() {
    const db = getDb();
    try {
      await db.collection('users').insertOne(this);
    } catch (error) {
      console.log('User Save Error', error);
    }
  }

  static async findById(userId: string) {
    if (!ObjectId.isValid(userId)) return null; // immediately cancels function when invalid URL entered
    const _id = new ObjectId(userId); // convert stringId to Mongo ObjectId
    const db = getDb();
    try {
      return await db.collection<User>('users').findOne({ _id });
    } catch (error) {
      console.log('User findById Error', error);
    }
  }

  async updateCart(_id: string, quantity: 1 | -1) {
    const index = this.cart.findIndex(( { itemId } ) => itemId.toString() === _id);

    if (index !== -1) {
      this.cart[index].quantity += quantity;

      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
    } else if (quantity === 1) {
      const itemId = new ObjectId(_id);
      this.cart = [{ itemId, quantity: 1 }, ...this.cart];
    }

    try {
      await getDb()
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
    } catch (error) {
      console.log('User updateCart Error', error);
    }
  }

  async getCart() {
    const db = getDb();
    const cartIds = this.cart.map(({ itemId }) => itemId);

    try {
      const items = await db
        .collection('items')
        .find({ _id: { $in: cartIds } })
        .toArray();

      // remove deleted items by other users from current user's cart and update
      const foundIds = items.map(({ _id }) => _id.toString());
      this.cart = this.cart.filter(({ itemId }) => foundIds.includes(itemId.toString()));
      await getDb()
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: this.cart } });

      return items.map((item) => {
        const quantity = this.cart.find(
          (cartItem) => cartItem.itemId.toString() === item._id.toString()
        )?.quantity;
        return { ...item, quantity };
      });
    } catch (error) {
      console.log('User getCart Error', error);
    }
  }
}
