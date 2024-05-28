import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';

const router = Router();
const menuController = new MenuController();

router.use(authenticate);

router.get('/:pkid', (req, res) => menuController.getById(req, res));
router.get('/', (req, res) => menuController.getAll(req, res));
router.post('/', (req, res) => menuController.create(req, res));
router.put('/:pkid', (req, res) => menuController.update(req, res));
router.delete('/:pkid', (req, res) => menuController.delete(req, res));

export default router;
