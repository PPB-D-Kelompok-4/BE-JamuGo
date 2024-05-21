import { BaseEntity } from '../interfaces/baseEntity.model';

export interface OrderItemAttributes {
  pkid: number;
  order_pkid: number;
  menu_pkid: number;
  quantity: number;
  price: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class OrderItem extends BaseEntity implements OrderItemAttributes {
    pkid!: number;
    order_pkid!: number;
    menu_pkid!: number;
    quantity!: number;
    price!: number;
  }

  OrderItem.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      order_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Orders',
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
      modelName: 'OrderItem',
      tableName: 'OrderItems',
      timestamps: false,
    },
  );

  return OrderItem;
};
