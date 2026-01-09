import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', TransactionController.create);
router.get('/', TransactionController.list);
router.patch('/:id/status', TransactionController.updateStatus);
router.delete('/:id', TransactionController.delete);

export default router;
