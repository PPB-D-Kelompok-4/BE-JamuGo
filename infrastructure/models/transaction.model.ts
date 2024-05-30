import { BaseEntity } from '../interfaces/baseEntity.model';

export interface TransactionAttributes {
  pkid?: number;
  order_pkid: number;
  payment_status: string;
  payment_method: string;
  transaction_date: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Transaction extends BaseEntity implements TransactionAttributes {
    pkid!: number;
    order_pkid!: number;
    payment_status!: string;
    payment_method!: string;
    transaction_date!: Date;
  }

  Transaction.init(
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
          model: 'orders',
          key: 'pkid',
        },
      },
      payment_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: false,
    },
  );

  return Transaction;
};
