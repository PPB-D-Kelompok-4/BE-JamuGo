import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';

const router = Router();
const paymentController = new PaymentController();

router.post('/', authenticate, (req, res) =>
  paymentController.createPayment(req, res),
);
router.get('/:pkid', authenticate, (req, res) =>
  paymentController.getPaymentById(req, res),
);
router.put('/:pkid', authenticate, (req, res) =>
  paymentController.updatePaymentStatus(req, res),
);
router.post('/initiate', authenticate, (req, res) =>
  paymentController.initiateTransaction(req, res),
);
router.post('/snap/initiate', authenticate, (req, res) =>
  paymentController.initiateSnapTransaction(req, res),
);

export default router;
