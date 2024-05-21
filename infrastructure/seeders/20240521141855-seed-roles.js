'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          name: 'customer',
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'admin',
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
