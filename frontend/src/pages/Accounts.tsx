import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

interface Account {
    id: string;
    name: string;
    bankName?: string;
    type: string;
}

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: '', bankName: '', type: 'CHECKING' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/accounts');
            setAccounts(response.data);
        } catch (err) {
            console.error('Erro ao buscar contas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/accounts', newAccount);
            setIsModalOpen(false);
            setNewAccount({ name: '', bankName: '', type: 'CHECKING' });
            fetchAccounts();
        } catch (err) {
            console.error('Erro ao criar conta:', err);
        }
    };

    const deleteAccount = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
        try {
            await api.delete(`/accounts/${id}`);
            fetchAccounts();
        } catch (err) {
            console.error('Erro ao excluir conta:', err);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Contas Bancárias</h2>
                        <p className="text-slate-500 mt-2">Gerencie suas contas e saldos.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 transition-all active:scale-95"
                    >
                        + Nova Conta
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map((account) => (
                            <div key={account.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative group">
                                <button
                                    onClick={() => deleteAccount(account.id)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl mb-4 text-primary-600">
                                    🏦
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{account.name}</h3>
                                <p className="text-slate-500 text-sm mb-4">{account.bankName || 'Banco não informado'}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full uppercase">
                                        {account.type}
                                    </span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">R$ 0,00</span>
                                </div>
                            </div>
                        ))}
                        {accounts.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500">Nenhuma conta cadastrada ainda.</p>
                            </div>
                        )}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold mb-6">Nova Conta</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nome da Conta</label>
                                    <input
                                        type="text"
                                        required
                                        value={newAccount.name}
                                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Ex: Conta Corrente"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Banco</label>
                                    <input
                                        type="text"
                                        value={newAccount.bankName}
                                        onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Ex: Itaú, Nubank..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tipo</label>
                                    <select
                                        value={newAccount.type}
                                        onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="CHECKING">Conta Corrente</option>
                                        <option value="SAVINGS">Poupança</option>
                                        <option value="INVESTMENT">Investimento</option>
                                        <option value="CASH">Dinheiro em Espécie</option>
                                    </select>
                                </div>
                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all"
                                    >
                                        Criar
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

export default AccountsPage;
