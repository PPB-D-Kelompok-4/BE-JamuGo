import { BaseEntity } from '../interfaces/baseEntity.model';

export interface RoleAttributes {
  pkid: number;
  name: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Role extends BaseEntity implements RoleAttributes {
    pkid!: number;
    name!: string;
  }

  Role.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      timestamps: true,
      paranoid: true,
    },
  );

  return Role;
};
