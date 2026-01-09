import { Router } from 'express';
import { TransferController } from '../controllers/transfer.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', TransferController.create);

export default router;
