import {
  INTEGER,
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
} from 'sequelize';
import sequelize from '../data/database';

class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
  declare       id: CreationOptional<number>;
  declare quantity: number;
}

OrderItem.init(
  {
          id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: INTEGER }
  },
  { sequelize, modelName: 'orderItem' }
);

export default OrderItem;
