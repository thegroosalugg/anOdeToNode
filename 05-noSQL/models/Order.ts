import {
  INTEGER,
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  HasManyGetAssociationsMixin, BelongsToManyAddAssociationsMixin
} from 'sequelize';
import sequelize from '../data/database';
import Item from './Item';

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare       id: CreationOptional<number>;
  declare addItems: BelongsToManyAddAssociationsMixin<Item, number>;
}

Order.init(
  { id: { type: INTEGER, primaryKey: true, autoIncrement: true }},
  { sequelize, modelName: 'order' }
);

export default Order;
