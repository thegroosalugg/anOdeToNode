import {
  INTEGER,
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  // HasManyCreateAssociationMixin, HasManyGetAssociationsMixin
} from 'sequelize';
import sequelize from '../data/database';
class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: CreationOptional<number>;
}

Cart.init(
  { id: { type: INTEGER, primaryKey: true, autoIncrement: true }},
  { sequelize, modelName: 'cart' }
);

export default Cart;
