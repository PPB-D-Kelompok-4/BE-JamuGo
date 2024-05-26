import { BaseEntity } from '../interfaces/baseEntity.model';

export interface CartAttributes {
  pkid: number;
  user_pkid: number;
  total_price: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Cart extends BaseEntity implements CartAttributes {
    pkid!: number;
    user_pkid!: number;
    total_price!: number;
  }

  Cart.init(
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
      total_price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'carts',
      timestamps: false,
    },
  );

  return Cart;
};
