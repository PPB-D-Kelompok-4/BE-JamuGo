import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';

const router = Router();
const orderController = new OrderController();

router.post('/', authenticate, (req, res) => orderController.createOrder(req, res));
router.get('/:pkid', authenticate, (req, res) => orderController.getOrderById(req, res));
router.get('/orders', authenticate, (req, res) => orderController.getOrdersByUser(req, res));
router.delete('/:pkid', authenticate, (req, res) => orderController.cancelOrder(req, res));

export default router;
