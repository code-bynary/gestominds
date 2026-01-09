import prisma from '../config/database';

export class DashboardRepository {
    static async getSummary(tenantId: string) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // 1. Total Balance (All time)
        const totalTransactions = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                tenantId,
                status: 'CONFIRMED'
            },
            _sum: { amount: true }
        });

        const incomeSum = totalTransactions.find(t => t.type === 'INCOME')?._sum.amount || 0;
        const expenseSum = totalTransactions.find(t => t.type === 'EXPENSE')?._sum.amount || 0;
        const totalBalance = incomeSum - expenseSum;

        // 2. Monthly Summary (Current Month)
        const monthlyTransactions = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                tenantId,
                status: 'CONFIRMED',
                date: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                }
            },
            _sum: { amount: true }
        });

        const monthlyIncome = monthlyTransactions.find(t => t.type === 'INCOME')?._sum.amount || 0;
        const monthlyExpense = monthlyTransactions.find(t => t.type === 'EXPENSE')?._sum.amount || 0;

        // 3. Last 6 Months Data for Chart
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const chartTransactions = await prisma.transaction.findMany({
            where: {
                tenantId,
                status: 'CONFIRMED',
                date: { gte: sixMonthsAgo }
            },
            select: {
                amount: true,
                type: true,
                date: true
            }
        });

        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const chartData = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            const monthLabel = months[d.getMonth()];

            const monthIncome = chartTransactions
                .filter(t => t.date.getMonth() === d.getMonth() && t.date.getFullYear() === d.getFullYear() && t.type === 'INCOME')
                .reduce((sum, t) => sum + t.amount, 0);

            const monthExpense = chartTransactions
                .filter(t => t.date.getMonth() === d.getMonth() && t.date.getFullYear() === d.getFullYear() && t.type === 'EXPENSE')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                name: monthLabel,
                receita: monthIncome,
                despesa: monthExpense
            };
        });

        return {
            totalBalance,
            monthlyIncome,
            monthlyExpense,
            chartData
        };
    }
}
