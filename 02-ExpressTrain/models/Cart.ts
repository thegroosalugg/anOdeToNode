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

  static addItem(id: string) {
    readJSONFile<CartItem>(filePath, (cart) => {
      const itemIndex = cart.findIndex((item: CartItem) => item.id === id);

      if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
      } else {
        cart = [{ id, quantity: 1 }, ...cart];
      }

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static removeItem(id: string) {
    readJSONFile<CartItem>(filePath, (cart) => {
      cart.filter((item: CartItem) => item.id !== id);

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
}
