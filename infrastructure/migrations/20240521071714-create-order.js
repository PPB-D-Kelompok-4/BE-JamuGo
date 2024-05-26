'use strict';

let DataTypes;
({ DataTypes } = require('sequelize'));

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('orders', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
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
    await queryInterface.dropTable('orders');
  },
};
