import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';

const router = Router();
const orderController = new OrderController();

// Specific routes first
router.get('/last', authenticate, (req, res) =>
  orderController.getLastOrderByUser(req, res),
);
router.put('/status/:pkid', authenticate, (req, res) =>
  orderController.updateOrderStatus(req, res),
);
router.put('/cancel/:pkid', authenticate, (req, res) =>
  orderController.cancelOrder(req, res),
);
router.get('/:pkid', authenticate, (req, res) =>
  orderController.getOrderById(req, res),
);

// General routes
router.post('/', authenticate, (req, res) =>
  orderController.createOrder(req, res),
);
router.get('/', authenticate, (req, res) =>
  orderController.getOrdersByUser(req, res),
);

export default router;
