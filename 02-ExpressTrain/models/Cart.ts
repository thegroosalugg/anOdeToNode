import fs from 'fs';
import { join } from 'path';
import readJSONFile from '../util/readJSONfile';

const filePath = join(import.meta.dirname, '../', 'data', 'cart.json');

interface CartItem {
        id: string;
  quantity: number;
}

export default class Cart {
  static getItems(callback: (cart: CartItem[]) => void) {
    readJSONFile(filePath, callback)
  }

  static update(id: string, quantity: 1 | -1) {
    readJSONFile<CartItem>(filePath, (cart) => {
      const index = cart.findIndex((item: CartItem) => item.id === id);

      if (index !== -1) {
        cart[index].quantity += quantity;

        if (cart[index].quantity === 0) {
          cart.splice(index, 1);
        }
      } else if (quantity === 1) {
        cart = [{ id, quantity }, ...cart];
      }

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
}
