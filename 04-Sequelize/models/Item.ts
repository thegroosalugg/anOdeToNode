import {
  Model, INTEGER, STRING, REAL,
  InferAttributes, InferCreationAttributes, CreationOptional,
} from 'sequelize';
import sequelize from '../data/database';

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare     id: CreationOptional<number>;
  declare   name: string;
  declare   desc: string;
  declare imgURL: string;
  declare  price: number;
}

Item.init(
  {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: STRING,   allowNull: false },
      desc: { type: STRING,   allowNull: false },
    imgURL: { type: STRING,   allowNull: false },
     price: { type: REAL,     allowNull: false },
  },
  { sequelize, modelName: 'item' }
);

export default Item;
