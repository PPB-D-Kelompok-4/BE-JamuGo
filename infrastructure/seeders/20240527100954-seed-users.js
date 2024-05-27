'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = await queryInterface.sequelize.query(
      `SELECT pkid, name FROM roles;`
    );

    const roleMap = {};
    roles[0].forEach(role => {
      roleMap[role.name] = role.pkid;
    });

    const users = [
      {
        uuid: 'admin-uuid',
        role_pkid: roleMap['admin'],
        email: 'admin@jamugo.com',
        password: await bcrypt.hash('Admin@123', 10),
        name: 'admin',
        address: 'Admin Address',
        image_profile: 'admin-' + roleMap['admin'] + '-admin-uuid.jpg',
        created_by: 'system',
        created_date: new Date(),
        created_host: 'localhost',
        is_deleted: false,
      },
      {
        uuid: 'customer1-uuid',
        role_pkid: roleMap['customer'],
        email: 'customer1@jamugo.com',
        password: await bcrypt.hash('Customer1@123', 10),
        name: 'customer1',
        address: 'Customer1 Address',
        image_profile: 'customer1-' + roleMap['customer'] + '-customer1-uuid.jpg',
        created_by: 'system',
        created_date: new Date(),
        created_host: 'localhost',
        is_deleted: false,
      },
      {
        uuid: 'customer2-uuid',
        role_pkid: roleMap['customer'],
        email: 'customer2@jamugo.com',
        password: await bcrypt.hash('Customer2@123', 10),
        name: 'customer2',
        address: 'Customer2 Address',
        image_profile: 'customer2-' + roleMap['customer'] + '-customer2-uuid.jpg',
        created_by: 'system',
        created_date: new Date(),
        created_host: 'localhost',
        is_deleted: false,
      },
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
