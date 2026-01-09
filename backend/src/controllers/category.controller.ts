import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CategoryRepository } from '../repositories/category.repository';

export class CategoryController {
    static async create(req: AuthRequest, res: Response) {
        try {
            const { name, type, parentId } = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const category = await CategoryRepository.create({
                name,
                type,
                parentId,
                tenantId
            });

            res.status(201).json(category);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async list(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const categories = await CategoryRepository.findTreesByTenant(tenantId);
            res.json(categories);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            await CategoryRepository.delete(id, tenantId);
            res.status(204).send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
