import prisma from '../config/database';
import { TransactionType } from '@prisma/client';

export interface CreateCategoryDTO {
    name: string;
    type: TransactionType;
    parentId?: string;
    tenantId: string;
}

export class CategoryRepository {
    static async create(data: CreateCategoryDTO) {
        return prisma.category.create({
            data
        });
    }

    static async findByTenant(tenantId: string) {
        return prisma.category.findMany({
            where: { tenantId },
            include: {
                children: true
            },
            orderBy: { name: 'asc' }
        });
    }

    static async findTreesByTenant(tenantId: string) {
        // Fetch all categories and build tree in memory or use recursive query
        // For simplicity, fetch all and filter parents
        const all = await prisma.category.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' }
        });

        const roots = all.filter(c => !c.parentId);
        const buildTree = (parent: any) => {
            parent.children = all.filter(c => c.parentId === parent.id).map(buildTree);
            return parent;
        };

        return roots.map(buildTree);
    }

    static async delete(id: string, tenantId: string) {
        // Note: Prisma will handle referential integrity based on schema.
        // If we want to allow deleting parents, we should decide on behavior (cascade vs protect).
        return prisma.category.deleteMany({
            where: { id, tenantId }
        });
    }
}
