import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', AccountController.create);
router.get('/', AccountController.list);
router.delete('/:id', AccountController.delete);

export default router;
