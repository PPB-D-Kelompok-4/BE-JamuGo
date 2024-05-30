import { MidtransClient } from 'midtrans-node-client'

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;

if (!MIDTRANS_SERVER_KEY || !MIDTRANS_CLIENT_KEY) {
  throw new Error('Midtrans API keys are not set in environment variables.');
}

const coreApi = new MidtransClient.CoreApi({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

export default coreApi;
