import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/excel', ReportController.exportExcel);
router.get('/pdf', ReportController.exportPdf);

export default router;
