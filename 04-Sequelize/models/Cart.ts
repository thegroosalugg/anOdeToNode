import {
  INTEGER,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
} from 'sequelize';
import sequelize from '../data/database';
import Item from './Item';
import CartItem from './CartItem';
import OrderItem from './OrderItem';

export type clientCartItem = Item & { cartItem: CartItem } & { orderItem: Partial<OrderItem> };

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare       id: CreationOptional<number>;
  declare  addItem: BelongsToManyAddAssociationMixin<Item, number>;
  declare getItems: HasManyGetAssociationsMixin<clientCartItem>;
  declare setItems: BelongsToManySetAssociationsMixin<Item, number>;
}

Cart.init(
  { id: { type: INTEGER, primaryKey: true, autoIncrement: true } },
  { sequelize, modelName: 'cart' }
);

export default Cart;
