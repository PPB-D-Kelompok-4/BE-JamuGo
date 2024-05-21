import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';

const router = Router();
const userController = new UserController();

router.use(authenticate);

router.put('/:pkid', (req, res) => userController.update(req, res));
router.get('/firebase', (req, res) => userController.getFirebaseData(req, res));
router.post('/reset-password', (req, res) => userController.resetPassword(req, res));

export default router;
