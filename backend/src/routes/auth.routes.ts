import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { RefreshController } from '../controllers/refresh.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', RefreshController.refresh);

export default router;
