import prisma from '../config/database';

export interface CreateTransferDTO {
    description: string;
    amount: number;
    date: Date;
    fromAccountId: string;
    toAccountId: string;
    categoryId: string; // Internal category for transfers
    tenantId: string;
}

export class TransferRepository {
    static async create(data: CreateTransferDTO) {
        return prisma.$transaction(async (tx) => {
            // 1. Create the Expense Transaction (Withdrawal)
            const withdrawal = await tx.transaction.create({
                data: {
                    description: `Transferência: ${data.description}`,
                    amount: data.amount,
                    date: data.date,
                    competenceDate: data.date,
                    type: 'EXPENSE',
                    status: 'CONFIRMED',
                    tenantId: data.tenantId,
                    accountId: data.fromAccountId,
                    categoryId: data.categoryId,
                }
            });

            // 2. Create the Income Transaction (Deposit)
            const deposit = await tx.transaction.create({
                data: {
                    description: `Transferência: ${data.description}`,
                    amount: data.amount,
                    date: data.date,
                    competenceDate: data.date,
                    type: 'INCOME',
                    status: 'CONFIRMED',
                    tenantId: data.tenantId,
                    accountId: data.toAccountId,
                    categoryId: data.categoryId,
                    linkedTransactionId: withdrawal.id // Link them
                }
            });

            // 3. Update withdrawal to link back to deposit
            await tx.transaction.update({
                where: { id: withdrawal.id },
                data: { linkedTransactionId: deposit.id }
            });

            return { withdrawal, deposit };
        });
    }
}
