import prisma from '../config/database';
import { TenantType, Role } from '@prisma/client';

export class AuthRepository {
    static async createUserWithTenant(data: { name: string, email: string, passwordHash: string }) {
        return prisma.$transaction(async (tx) => {
            // 1. Create a default Personal Tenant for the user
            const tenant = await tx.tenant.create({
                data: {
                    name: `Meu Financeiro (${data.name})`,
                    type: TenantType.PERSONAL,
                }
            });

            // 2. Create the User
            const user = await tx.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.passwordHash,
                }
            });

            // 3. Link User and Tenant as OWNER
            await tx.userTenant.create({
                data: {
                    userId: user.id,
                    tenantId: tenant.id,
                    role: Role.OWNER,
                }
            });

            return { user, tenant };
        });
    }

    static async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: {
                tenants: {
                    include: {
                        tenant: true
                    }
                }
            }
        });
    }
}
