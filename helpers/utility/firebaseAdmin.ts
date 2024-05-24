import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccountPath = path.resolve(
  __dirname,
  '../../infrastructure/config/serviceAccountKey.json',
);
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
