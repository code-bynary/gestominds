import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { DashboardRepository } from '../repositories/dashboard.repository';

export class DashboardController {
    static async getSummary(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

            const summary = await DashboardRepository.getSummary(tenantId);
            res.json(summary);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}
