import { Router } from 'express';
import { PersonController } from '../controllers/person.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', PersonController.create);
router.get('/', PersonController.list);
router.put('/:id', PersonController.update);
router.delete('/:id', PersonController.delete);

export default router;
