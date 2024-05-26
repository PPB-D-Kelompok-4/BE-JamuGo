'use strict';

let DataTypes;
({ DataTypes } = require('sequelize'));

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('users', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      uuid: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      role_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'pkid',
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_profile: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable('users');
  },
};
