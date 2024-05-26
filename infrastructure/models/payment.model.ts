import { BaseEntity } from '../interfaces/baseEntity.model';

export interface PaymentAttributes {
  pkid: number;
  transaction_pkid: number;
  payment_gateway: string;
  payment_status: string;
  payment_amount: number;
  transaction_gateway_id: string;
  payment_date: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Payment extends BaseEntity implements PaymentAttributes {
    pkid!: number;
    transaction_pkid!: number;
    payment_gateway!: string;
    payment_status!: string;
    payment_amount!: number;
    transaction_gateway_id!: string;
    payment_date!: Date;
  }

  Payment.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      transaction_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'pkid',
        },
      },
      payment_gateway: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      payment_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      transaction_gateway_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      timestamps: false,
    },
  );

  return Payment;
};
