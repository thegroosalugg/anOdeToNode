import {
  INTEGER,
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
} from 'sequelize';
import sequelize from '../data/database';

class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
  declare       id: CreationOptional<number>;
  declare quantity: number;
}

CartItem.init(
  {
          id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: INTEGER, defaultValue: 1 }
  },
  { sequelize, modelName: 'cartItem' }
);

export default CartItem;
