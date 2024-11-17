import { INTEGER, STRING, REAL } from 'sequelize';
import sequelize from '../data/database';

const Item = sequelize.define('item', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type:  STRING,  allowNull: false },
    desc: { type:  STRING,  allowNull: false },
  imgURL: { type:  STRING,  allowNull: false },
   price: { type:    REAL,  allowNull: false },
});

export default Item;
