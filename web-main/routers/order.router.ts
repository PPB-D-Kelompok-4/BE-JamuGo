import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';

const router = Router();
const orderController = new OrderController();

//region User Routes

router.post('/', authenticate, (req, res) =>
  orderController.createOrder(req, res),
);

router.get('/', authenticate, (req, res) =>
  orderController.getOrdersByUser(req, res),
);

router.get('/last', authenticate, (req, res) =>
  orderController.getLastOrderByUser(req, res),
);

router.get('/transaction/:orderPkid', authenticate, (req, res) =>
  orderController.getTransactionByOrderId(req, res),
);

router.put('/status/:pkid', authenticate, (req, res) =>
  orderController.updateOrderStatus(req, res),
);

router.put('/cancel/:pkid', authenticate, (req, res) =>
  orderController.cancelOrder(req, res),
);

router.put('/finish/:pkid', authenticate, (req, res) =>
  orderController.finishOrder(req, res),
);

router.put('/process/:pkid', authenticate, (req, res) =>
  orderController.processOrder(req, res),
);

router.get('/:pkid', authenticate, (req, res) =>
  orderController.getOrderById(req, res),
);

//endregion

//region Admin Routes

router.get('/admin/all', authenticate, (req, res) =>
  orderController.getAllOrders(req, res),
);

router.put('/admin/cancel', authenticate, (req, res) =>
  orderController.cancelOrderByAdmin(req, res),
);


//endregion

export default router;
