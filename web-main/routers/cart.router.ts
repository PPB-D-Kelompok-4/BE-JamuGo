import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';

const router = Router();
const cartController = new CartController();

router.use(authenticate);

router.get('/user', (req, res) => cartController.getCartByUser(req, res));
router.post('/item', (req, res) => cartController.addItem(req, res));
router.delete('/item/:pkid', (req, res) => cartController.deleteItem(req, res));
router.get('/items/:cart_pkid', (req, res) => cartController.getCartItems(req, res));

export default router;
