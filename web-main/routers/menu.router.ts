import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../helpers/assets/image-menus'));
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + sanitizedFileName);
  },
});

const upload = multer({ storage: storage });

const router = Router();
const menuController = new MenuController();

router.use(authenticate);

router.get('/:pkid', (req, res) => menuController.getById(req, res));
router.get('/', (req, res) => menuController.getAll(req, res));
router.post('/', upload.single('image_url'), (req, res) =>
  menuController.create(req, res),
);
router.put('/:pkid', upload.single('image_url'), (req, res) =>
  menuController.update(req, res),
);
router.delete('/:pkid', (req, res) => menuController.delete(req, res));

export default router;
