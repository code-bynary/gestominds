import prisma from '../config/database';
import { TransactionType, TransactionStatus } from '@prisma/client';

export interface CreateTransactionDTO {
    description: string;
    amount: number;
    date: Date;
    competenceDate: Date;
    type: TransactionType;
    status: TransactionStatus;
    tenantId: string;
    accountId: string;
    categoryId: string;
    costCenterId?: string;
    personId?: string;
}

export class TransactionRepository {
    static async create(data: CreateTransactionDTO) {
        return prisma.transaction.create({
            data: {
                ...data,
                amount: data.amount // Prisma handles Decimal conversion if schema uses Decimal
            },
            include: {
                account: true,
                category: true
            }
        });
    }

    static async findByTenant(tenantId: string, filters?: { startDate?: Date, endDate?: Date }) {
        return prisma.transaction.findMany({
            where: {
                tenantId,
                date: {
                    gte: filters?.startDate,
                    lte: filters?.endDate
                }
            },
            include: {
                account: true,
                category: true
            },
            orderBy: { date: 'desc' }
        });
    }

    static async delete(id: string, tenantId: string) {
        return prisma.transaction.deleteMany({
            where: { id, tenantId }
        });
    }

    static async updateStatus(id: string, tenantId: string, status: TransactionStatus) {
        return prisma.transaction.updateMany({
            where: { id, tenantId },
            data: { status }
        });
    }
}
