import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';

const router = Router();
const transactionController = new TransactionController();

router.get('/:pkid', authenticate, (req, res) =>
  transactionController.getTransactionById(req, res),
);
router.get('/order/:orderPkid', authenticate, (req, res) =>
  transactionController.getTransactionsByOrderId(req, res),
);
router.get('/', authenticate, (req, res) =>
  transactionController.getTransactions(req, res),
);
router.put('/status/:pkid', authenticate, (req, res) =>
  transactionController.updateTransactionStatus(req, res),
);
router.put('/payment-method/:pkid', authenticate, (req, res) =>
  transactionController.updateTransactionPaymentMethod(req, res),
);

export default router;
