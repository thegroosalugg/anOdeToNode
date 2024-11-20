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

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare         id: CreationOptional<number>;
  declare       name: string;
  declare      email: string;
  declare createItem: HasManyCreateAssociationMixin<Item>;
  declare   getItems: HasManyGetAssociationsMixin<Item>;
  declare createCart: HasOneCreateAssociationMixin<Cart>;
  declare    getCart: HasOneGetAssociationMixin<Cart>;
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
