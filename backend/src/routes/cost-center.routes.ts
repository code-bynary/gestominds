import { Router } from 'express';
import { CostCenterController } from '../controllers/cost-center.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', CostCenterController.list);
router.post('/', CostCenterController.create);
router.put('/:id', CostCenterController.update);
router.delete('/:id', CostCenterController.delete);

export default router;
