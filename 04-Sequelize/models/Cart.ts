import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./data/mountain.db');
interface CartItem {
        id: number;
  quantity: number;
}

export default class Cart {
  static getItems(callback: (cart: CartItem[]) => void) {
    // db.all('SELECT * FROM cart', (err, items: CartItem[]) => {
    //   if (err) {
    //     console.error('Class Item/FetchAll Error:', err);
    //     callback([]);
    //   } else {
    //     callback(items);
    //   }
    // });
  }

  static update(id: number, quantity: 1 | -1) {
    // db.get('SELECT * FROM cart WHERE id = ?', id, (err, item: CartItem) => {
    //   if (item) {
    //     item.quantity += quantity;

    //     if (item.quantity === 0) {
    //       db.run('DELETE FROM cart WHERE id = ?', id);
    //     } else {
    //       db.run('UPDATE cart SET quantity = ? WHERE id = ?', [item.quantity, id]);
    //     }
    //   } else if (quantity === 1) {
    //     db.run('INSERT INTO cart (id) VALUES (?)', [id]);
    //   }
    // });
  }
}
