import { BaseEntity } from '../interfaces/baseEntity.model';

export interface OrderStatusAttributes {
  pkid: number;
  order_pkid: number;
  status: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class OrderStatus extends BaseEntity implements OrderStatusAttributes {
    pkid!: number;
    order_pkid!: number;
    status!: string;
  }

  OrderStatus.init(
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
      status: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'OrderStatus',
      tableName: 'OrderStatuses',
      timestamps: false,
    },
  );

  return OrderStatus;
};
