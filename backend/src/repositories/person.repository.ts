import prisma from '../config/database';

export interface CreatePersonDTO {
    name: string;
    document?: string;
    email?: string;
    phone?: string;
    tenantId: string;
}

export class PersonRepository {
    static async create(data: CreatePersonDTO) {
        return prisma.person.create({
            data
        });
    }

    static async findByTenant(tenantId: string) {
        return prisma.person.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' }
        });
    }

    static async findById(id: string, tenantId: string) {
        return prisma.person.findFirst({
            where: { id, tenantId }
        });
    }

    static async update(id: string, tenantId: string, data: Partial<CreatePersonDTO>) {
        return prisma.person.updateMany({
            where: { id, tenantId },
            data
        });
    }

    static async delete(id: string, tenantId: string) {
        return prisma.person.deleteMany({
            where: { id, tenantId }
        });
    }
}
