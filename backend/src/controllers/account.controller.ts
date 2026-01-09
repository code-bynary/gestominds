import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AccountRepository } from '../repositories/account.repository';

export class AccountController {
    static async create(req: AuthRequest, res: Response) {
        try {
            const { name, bankName, type } = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const account = await AccountRepository.create({
                name,
                bankName,
                type,
                tenantId
            });

            res.status(201).json(account);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async list(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const accounts = await AccountRepository.findByTenant(tenantId);
            res.json(accounts);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            await AccountRepository.delete(id, tenantId);
            res.status(204).send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
