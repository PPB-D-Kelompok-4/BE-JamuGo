import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';

const router = Router();
const roleController = new RoleController();

// Find methods
router.get('/', (req, res) => roleController.findAllRoles(req, res));
router.get('/name/:name', (req, res) =>
  roleController.findRoleByName(req, res),
);
router.get('/:pkid', (req, res) => roleController.findRoleByID(req, res));
router.get('/exists', (req, res) => roleController.roleExists(req, res));

// Create methods
router.post('/', (req, res) => roleController.createRole(req, res));

// Update methods
router.put('/:pkid', (req, res) => roleController.updateRole(req, res));

// Delete methods
router.delete('/soft/:pkid', (req, res) =>
  roleController.softDeleteRole(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  roleController.hardDeleteRole(req, res),
);

// Restore methods
router.post('/restore/:pkid', (req, res) =>
  roleController.restoreRole(req, res),
);

export default router;
