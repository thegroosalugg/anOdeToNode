import { ObjectId } from 'mongodb';
import { getDb } from '../data/database';
import Item from './Item';

       type CartItem = { itemId: ObjectId; quantity: number };
export type    Order = { userId: ObjectId; name: string, email: string; items: Item[] };

export default class User {
     _id?: ObjectId; // taken care of by Mongo. Explicitly added to handle server requests
     name: string;
    email: string;
     cart: CartItem[];
   orders:    Order[];

   constructor({
      name,
     email,
      cart,
    orders,
       _id,
  }: {
       name: string;
      email: string;
      cart?: CartItem[];
    orders?:    Order[];
       _id?: ObjectId;
  }) {
    this.name   = name;
    this.email  = email;
    this.cart   = cart   || [];
    this.orders = orders || [];
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
    const index = this.cart.findIndex(({ itemId }) => itemId.toString() === _id);

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
        .collection<Item>('items')
        .find({ _id: { $in: cartIds } })
        .toArray();

      const  cartItems:   Item[] = [];
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
      await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: this.cart } });

      return cartItems;
    } catch (error) {
      console.log('User getCart Error', error);
      return [];
    }
  }

  async createOrder() {
    const db = getDb();
    const { _id, name, email } = this;
    const items = await this.getCart();
    const order = { userId: _id, name, email, items };
    this.cart = [];

    try {
      await db.collection('orders').insertOne(order);
      await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
    } catch (error) {
      console.log('User createOrder Error', error);
    }
  }

  async getOrders() {
    try {
      return await getDb()
        .collection<Order>('orders')
        .find({ userId: this._id })
        .toArray();
    } catch (error) {
      console.log('User getOrders Error', error);
      return [];
    }
  }
}
