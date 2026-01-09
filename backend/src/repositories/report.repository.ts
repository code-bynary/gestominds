import prisma from '../config/database';

export class ReportRepository {
    static async getTransactionData(tenantId: string, filters: any = {}) {
        return prisma.transaction.findMany({
            where: {
                tenantId,
                date: {
                    gte: filters.startDate ? new Date(filters.startDate) : undefined,
                    lte: filters.endDate ? new Date(filters.endDate) : undefined,
                },
                type: filters.type || undefined,
                status: filters.status || undefined,
            },
            include: {
                category: true,
                account: true,
                person: true,
            },
            orderBy: { date: 'desc' }
        });
    }
}
