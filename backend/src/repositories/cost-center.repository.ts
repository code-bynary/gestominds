import prisma from '../config/database';

export class CostCenterRepository {
    static async create(data: { name: string; tenantId: string }) {
        return prisma.costCenter.create({
            data
        });
    }

    static async list(tenantId: string) {
        return prisma.costCenter.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' }
        });
    }

    static async update(id: string, tenantId: string, data: { name: string }) {
        return prisma.costCenter.updateMany({
            where: { id, tenantId },
            data
        });
    }

    static async delete(id: string, tenantId: string) {
        return prisma.costCenter.deleteMany({
            where: { id, tenantId }
        });
    }
}
