import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TransactionRepository } from '../repositories/transaction.repository';

export class TransactionController {
    static async create(req: AuthRequest, res: Response) {
        try {
            const data = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const transaction = await TransactionRepository.create({
                ...data,
                date: new Date(data.date),
                competenceDate: new Date(data.competenceDate || data.date),
                amount: Number(data.amount),
                tenantId
            });

            res.status(201).json(transaction);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async list(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            const { startDate, endDate } = req.query;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const transactions = await TransactionRepository.findByTenant(tenantId, {
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined
            });

            res.json(transactions);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            await TransactionRepository.delete(id, tenantId);
            res.status(204).send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async updateStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            await TransactionRepository.updateStatus(id, tenantId, status);
            res.status(204).send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
