import * as admin from 'firebase-admin';

const serviceAccount = require('/path/to/your/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const auth = admin.auth();
