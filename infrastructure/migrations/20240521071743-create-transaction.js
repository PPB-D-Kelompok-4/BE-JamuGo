'use strict';

let DataTypes;
({ DataTypes } = require('sequelize'));

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('transactions', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
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
      created_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_host: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      updated_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_host: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      deleted_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      deleted_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_host: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('transactions');
  },
};
