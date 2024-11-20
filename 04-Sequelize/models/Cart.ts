import {
  INTEGER,
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  HasManyGetAssociationsMixin, BelongsToManyAddAssociationMixin
} from 'sequelize';
import sequelize from '../data/database';
import CartItem from './CartItem';
import Item from './Item';
class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare       id: CreationOptional<number>;
  declare  addItem: BelongsToManyAddAssociationMixin<Item, number>;
  declare getItems: HasManyGetAssociationsMixin<Item & { cartItem: CartItem }>;
}

Cart.init(
  { id: { type: INTEGER, primaryKey: true, autoIncrement: true }},
  { sequelize, modelName: 'cart' }
);

export default Cart;
