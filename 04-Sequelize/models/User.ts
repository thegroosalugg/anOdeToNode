import {
  INTEGER, STRING,
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin
} from 'sequelize';
import sequelize from '../data/database';
import Item from './Item';
import Cart from './Cart';
import Order from './Order';
import OrderItem from './OrderItem';

export type clientOrder = Order & { items: (Item & { orderItem: OrderItem })[] };

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare         id: CreationOptional<number>;
  declare       name: string;
  declare      email: string;
  declare  createItem: HasManyCreateAssociationMixin<Item>;
  declare    getItems: HasManyGetAssociationsMixin<Item>;
  declare  createCart: HasOneCreateAssociationMixin<Cart>;
  declare     getCart: HasOneGetAssociationMixin<Cart>;
  declare createOrder: HasManyCreateAssociationMixin<Order>;
  declare   getOrders: HasManyGetAssociationsMixin<clientOrder>;
}

User.init(
  {
       id: { type: INTEGER, primaryKey: true, autoIncrement: true },
     name: { type: STRING,   allowNull: false },
    email: { type: STRING,   allowNull: false },
  },
  { sequelize, modelName: 'user' }
);

export default User;
