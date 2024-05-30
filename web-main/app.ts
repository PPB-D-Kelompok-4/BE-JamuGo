import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../infrastructure/models';
import roleRouter from './routers/role.router';
import userRouter from './routers/user.router';
import menuRouter from './routers/menu.router';
import path from 'path';
import cartRouter from './routers/cart.router';
import orderRouter from './routers/order.router';
import transactionRouter from './routers/transaction.router';
import paymentRouter from './routers/payment.router';

dotenv.config();

// Create an instance of express
const app = express();

app.use(cors());

// Parse JSON and url-encoded query
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/assets', express.static(path.join(__dirname, '../helpers/assets')));

// Initialize database
db.sequelize
  .sync()
  .then(() => console.log('Database connected'))
  .catch((err: object) => console.log('Error syncing tables: ', err));

// Define routes
app.use('/api/role', roleRouter);
app.use('/api/user', userRouter);
app.use('/api/menu', menuRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/payment', paymentRouter);

// Set the port
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
