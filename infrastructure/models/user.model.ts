import { DataTypes, Model, Sequelize } from 'sequelize';
import { BaseEntity } from '../interfaces/baseEntity.model';

export interface UserAttributes {
  pkid: number;
  uuid: string;
  role_pkid: number;
  email: string;
  password: string;
  name: string;
  address?: string;
  image_profile?: string | null;
}

module.exports = (sequelize: Sequelize) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    pkid!: number;
    uuid!: string;
    role_pkid!: number;
    email!: string;
    password!: string;
    name!: string;
    address?: string;
    image_profile?: string | null;

    toJSON() {
      return { ...this.get() };
    }
  }

  User.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      role_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'pkid',
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_profile: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false,
    },
  );

  return User;
};
