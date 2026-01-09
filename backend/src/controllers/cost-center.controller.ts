import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CostCenterRepository } from '../repositories/cost-center.repository';

export class CostCenterController {
    static async create(req: AuthRequest, res: Response) {
        try {
            const { name } = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

            const costCenter = await CostCenterRepository.create({ name, tenantId });
            res.status(201).json(costCenter);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async list(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

            const costCenters = await CostCenterRepository.list(tenantId);
            res.json(costCenters);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    static async update(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            await CostCenterRepository.update(id, tenantId!, { name });
            res.json({ success: true });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            await CostCenterRepository.delete(id, tenantId!);
            res.status(204).end();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
