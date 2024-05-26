import { BaseEntity } from '../interfaces/baseEntity.model';

export interface MenuAttributes {
  pkid: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Menu extends BaseEntity implements MenuAttributes {
    pkid!: number;
    name!: string;
    description?: string;
    price!: number;
    image_url?: string;
  }

  Menu.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Menu',
      tableName: 'menus',
      timestamps: false,
    },
  );

  return Menu;
};
