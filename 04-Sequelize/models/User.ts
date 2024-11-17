import {
  INTEGER, STRING,
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
} from 'sequelize';
import sequelize from '../data/database';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare     id: CreationOptional<number>;
  declare   name: string;
  declare  email: string;
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
