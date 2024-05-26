import { BaseEntity } from '../interfaces/baseEntity.model';

export interface OrderAttributes {
  pkid: number;
  user_pkid: number;
  status: string;
  total_price: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Order extends BaseEntity implements OrderAttributes {
    pkid!: number;
    user_pkid!: number;
    status!: string;
    total_price!: number;
  }

  Order.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'pkid',
        },
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: false,
    },
  );

  return Order;
};
