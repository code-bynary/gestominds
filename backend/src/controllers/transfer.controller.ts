import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TransferRepository } from '../repositories/transfer.repository';

export class TransferController {
    static async create(req: AuthRequest, res: Response) {
        try {
            const data = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const result = await TransferRepository.create({
                ...data,
                date: new Date(data.date),
                amount: Number(data.amount),
                tenantId
            });

            res.status(201).json(result);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
