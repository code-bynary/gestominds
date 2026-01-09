import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', CategoryController.create);
router.get('/', CategoryController.list);
router.delete('/:id', CategoryController.delete);

export default router;
