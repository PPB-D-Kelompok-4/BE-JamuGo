import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../../helpers/utility/authMiddleware';
import multer from 'multer';

const router = Router();
const userController = new UserController();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));

router.use(authenticate);

router.get('/:pkid', (req, res) => userController.getById(req, res));
router.get('/', (req, res) => userController.getAll(req, res));
router.put('/:pkid', (req, res) => userController.update(req, res));
router.get('/firebase', (req, res) => userController.getFirebaseData(req, res));
router.post('/reset-password', (req, res) => userController.resetPassword(req, res));
router.post('/upload-profile-image', upload.single('image'), (req, res) => userController.uploadProfileImage(req, res));
router.get('/profile-image/:filename', (req, res) => userController.getProfileImage(req, res));

export default router;
