import { BaseEntity } from '../interfaces/baseEntity.model';

export interface UserAttributes {
  pkid: number;
  uuid: string;
  role_pkid: number;
  name: string;
  address?: string;
  image_profile?: string | null;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends BaseEntity implements UserAttributes {
    pkid!: number;
    uuid!: string;
    role_pkid!: number;
    name!: string;
    address?: string;
    image_profile?: string | null;
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
          model: 'Roles',
          key: 'pkid',
        },
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
      tableName: 'Users',
      timestamps: false,
    },
  );

  return User;
};
