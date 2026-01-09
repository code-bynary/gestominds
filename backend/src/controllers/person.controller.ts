import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { PersonRepository } from '../repositories/person.repository';

export class PersonController {
    static async create(req: AuthRequest, res: Response) {
        try {
            const data = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const person = await PersonRepository.create({
                ...data,
                tenantId
            });

            res.status(201).json(person);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async list(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const people = await PersonRepository.findByTenant(tenantId);
            res.json(people);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            await PersonRepository.delete(id, tenantId);
            res.status(204).send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async update(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;
            const tenantId = req.tenantId || req.headers['x-tenant-id'] as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            await PersonRepository.update(id, tenantId, data);
            res.status(204).send();
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
