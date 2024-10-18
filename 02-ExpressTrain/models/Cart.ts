import fs from 'fs';
import { join } from 'path';

const filePath = join(import.meta.dirname, '../', 'data', 'cart.json');

interface CartItem {
        id: string;
  quantity: number;
}
export default class Cart {
  static addItem(id: string, price: number) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      let cart = { items: [] as CartItem[], total: 0 };

      if (!err) {
        cart = JSON.parse(data);
      }

      const itemIndex = cart.items.findIndex((item: CartItem) => item.id === id);

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items = [{ id, quantity: 1 }, ...cart.items];
      }

      cart.total += price;

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
}
