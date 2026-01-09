import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: 'INCOME' | 'EXPENSE';
    status: 'PENDING' | 'CONFIRMED';
    account: { name: string };
    category: { name: string };
    person?: { name: string };
    linkedTransactionId?: string;
}

interface Account { id: string; name: string }
interface Category { id: string; name: string }
interface Person { id: string; name: string }

const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE',
        status: 'CONFIRMED',
        accountId: '',
        categoryId: '',
        personId: ''
    });

    const [transferData, setTransferData] = useState({
        description: 'Transferência entre contas',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        fromAccountId: '',
        toAccountId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transRes, accRes, catRes, peopleRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/accounts'),
                api.get('/categories'),
                api.get('/people')
            ]);
            setTransactions(transRes.data);
            setAccounts(accRes.data);
            setPeople(peopleRes.data);
            // Flatten categories for the select input
            const flatCats: Category[] = [];
            const flatten = (items: any[]) => {
                items.forEach(item => {
                    flatCats.push({ id: item.id, name: item.name });
                    if (item.children) flatten(item.children);
                });
            };
            flatten(catRes.data);
            setCategories(flatCats);
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transactions', {
                ...formData,
                amount: Number(formData.amount),
                personId: formData.personId || undefined
            });
            setIsModalOpen(false);
            setFormData({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                type: 'EXPENSE',
                status: 'CONFIRMED',
                accountId: '',
                categoryId: '',
                personId: ''
            });
            fetchData();
        } catch (err) {
            console.error('Erro ao criar transação:', err);
        }
    };

    const handleTransferSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // For simplicity, we'll use the first category available or create a hidden one.
            let transferCat = categories.find(c => c.name.toLowerCase().includes('transfer'));
            if (!transferCat) transferCat = categories[0];

            await api.post('/transfers', {
                ...transferData,
                categoryId: transferCat?.id
            });
            setIsTransferModalOpen(false);
            setTransferData({
                description: 'Transferência entre contas',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                fromAccountId: '',
                toAccountId: '',
            });
            fetchData();
        } catch (err) {
            console.error('Erro ao realizar transferência:', err);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Lançamentos</h2>
                        <p className="text-slate-500 mt-2">Controle suas entradas e saídas.</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsTransferModalOpen(true)}
                            className="px-6 py-3 border-2 border-primary-100 text-primary-600 dark:border-primary-900/30 dark:text-primary-400 font-bold rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all active:scale-95 text-sm sm:text-base flex items-center"
                        >
                            <span className="mr-2">⇄</span> Transferir
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 text-sm sm:text-base"
                        >
                            + Novo Lançamento
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Data</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Descrição / Pessoa</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Categoria</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Conta</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Valor</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(t.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {t.linkedTransactionId && <span className="mr-2 text-indigo-500" title="Transferência">⇄</span>}
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.description}</p>
                                                </div>
                                                {t.person && <p className="text-[10px] text-slate-400 uppercase font-bold">{t.person.name}</p>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {t.category.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {t.account.name}
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${t.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20'}`}>
                                                    {t.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {transactions.length === 0 && (
                                <div className="py-20 text-center text-slate-400">
                                    Nenhum lançamento encontrado.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Modal Lançamento */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold mb-6">Novo Lançamento</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all ${formData.type === 'INCOME' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400'}`}
                                    >
                                        Receita
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all ${formData.type === 'EXPENSE' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 text-slate-400'}`}
                                    >
                                        Despesa
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Descrição</label>
                                    <input
                                        type="text" required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Ex: Aluguel, Supermercado..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Valor</label>
                                        <input
                                            type="number" step="0.01" required
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                                            placeholder="0,00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Data</label>
                                        <input
                                            type="date" required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Conta</label>
                                        <select
                                            required
                                            value={formData.accountId}
                                            onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">Selecione...</option>
                                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Categoria</label>
                                        <select
                                            required
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">Selecione...</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Pessoa / Contato (Opcional)</label>
                                    <select
                                        value={formData.personId}
                                        onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Nenhum...</option>
                                        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>

                                <div className="flex space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!formData.accountId || !formData.categoryId}
                                        className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Lançar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Transferência */}
                {isTransferModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold mb-6">Realizar Transferência</h3>
                            <form onSubmit={handleTransferSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Descrição</label>
                                    <input
                                        type="text" required
                                        value={transferData.description}
                                        onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Valor</label>
                                        <input
                                            type="number" step="0.01" required
                                            value={transferData.amount}
                                            onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 font-bold text-indigo-600"
                                            placeholder="0,00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Data</label>
                                        <input
                                            type="date" required
                                            value={transferData.date}
                                            onChange={(e) => setTransferData({ ...transferData, date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-rose-500">Origem (Sai de)</label>
                                        <select
                                            required
                                            value={transferData.fromAccountId}
                                            onChange={(e) => setTransferData({ ...transferData, fromAccountId: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-transparent outline-none focus:ring-2 focus:ring-rose-500"
                                        >
                                            <option value="">Selecione...</option>
                                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-emerald-500">Destino (Entra em)</label>
                                        <select
                                            required
                                            value={transferData.toAccountId}
                                            onChange={(e) => setTransferData({ ...transferData, toAccountId: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-transparent outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="">Selecione...</option>
                                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsTransferModalOpen(false)}
                                        className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!transferData.fromAccountId || !transferData.toAccountId || transferData.fromAccountId === transferData.toAccountId}
                                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Transferir agora
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TransactionsPage;
