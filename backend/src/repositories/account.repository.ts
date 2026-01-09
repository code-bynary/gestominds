import prisma from '../config/database';
import { AccountType } from '@prisma/client';

export interface CreateAccountDTO {
    name: string;
    bankName?: string;
    type: AccountType;
    tenantId: string;
}

export class AccountRepository {
    static async create(data: CreateAccountDTO) {
        return prisma.account.create({
            data
        });
    }

    static async findByTenant(tenantId: string) {
        return prisma.account.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' }
        });
    }

    static async findById(id: string, tenantId: string) {
        return prisma.account.findFirst({
            where: { id, tenantId }
        });
    }

    static async update(id: string, tenantId: string, data: Partial<CreateAccountDTO>) {
        return prisma.account.updateMany({
            where: { id, tenantId },
            data
        });
    }

    static async delete(id: string, tenantId: string) {
        return prisma.account.deleteMany({
            where: { id, tenantId }
        });
    }
}
