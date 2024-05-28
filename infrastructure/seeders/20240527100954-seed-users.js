'use strict';

const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(
  __dirname,
  '../../infrastructure/config/serviceAccountKey.json',
);
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  up: async (queryInterface) => {
    const roles = await queryInterface.sequelize.query(
      `SELECT pkid, name FROM roles;`
    );

    const roleMap = {};
    roles[0].forEach(role => {
      roleMap[role.name] = role.pkid;
    });

    const users = [
      {
        email: 'admin@jamugo.com',
        password: 'Admin@123',
        name: 'admin',
        address: 'Admin Address',
        roleName: 'admin',
      },
      {
        email: 'customer1@jamugo.com',
        password: 'Customer1@123',
        name: 'customer1',
        address: 'Customer1 Address',
        roleName: 'customer',
      },
      {
        email: 'customer2@jamugo.com',
        password: 'Customer2@123',
        name: 'customer2',
        address: 'Customer2 Address',
        roleName: 'customer',
      },
    ];

    for (const user of users) {
      let userRecord;
      try {
        userRecord = await admin.auth().createUser({
          email: user.email,
          password: user.password,
        });
      } catch (error) {
        console.error(`Failed to create Firebase user for ${user.email}`, error);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const userToInsert = {
        uuid: userRecord.uid,
        role_pkid: roleMap[user.roleName],
        email: user.email,
        password: hashedPassword,
        name: user.name,
        address: user.address,
        image_profile: `${user.name}-${roleMap[user.roleName]}-${userRecord.uid}.jpg`,
        created_by: 'system',
        created_date: new Date(),
        created_host: 'localhost',
        is_deleted: false,
      };

      await queryInterface.bulkInsert('users', [userToInsert], {});
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
