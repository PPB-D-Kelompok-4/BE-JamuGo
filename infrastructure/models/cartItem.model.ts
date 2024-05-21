import { BaseEntity } from '../interfaces/baseEntity.model';

export interface CartItemAttributes {
  pkid: number;
  cart_pkid: number;
  menu_pkid: number;
  quantity: number;
  price: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class CartItem extends BaseEntity implements CartItemAttributes {
    pkid!: number;
    cart_pkid!: number;
    menu_pkid!: number;
    quantity!: number;
    price!: number;
  }

  CartItem.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cart_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Carts',
          key: 'pkid',
        },
      },
      menu_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Menus',
          key: 'pkid',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'CartItem',
      tableName: 'CartItems',
      timestamps: false,
    },
  );

  return CartItem;
};
