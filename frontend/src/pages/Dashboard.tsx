import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';

interface DashboardData {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    chartData: Array<{
        name: string;
        receita: number;
        despesa: number;
    }>;
}

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard/summary');
            setData(response.data);
        } catch (err) {
            console.error('Erro ao buscar dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Olá, {user?.name || 'Usuario'}!</h2>
                    <p className="text-slate-500 mt-2">Aqui está o resumo financeiro do seu negócio.</p>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card
                        title="Saldo Disponível"
                        value={formatCurrency(data?.totalBalance || 0)}
                        icon="💰"
                        color="bg-primary-50 dark:bg-primary-900/20"
                    />
                    <Card
                        title="Receitas (Mês)"
                        value={formatCurrency(data?.monthlyIncome || 0)}
                        icon="📈"
                        color="bg-emerald-50 dark:bg-emerald-900/20"
                        textColor="text-emerald-500"
                    />
                    <Card
                        title="Despesas (Mês)"
                        value={formatCurrency(data?.monthlyExpense || 0)}
                        icon="📉"
                        color="bg-rose-50 dark:bg-rose-900/20"
                        textColor="text-rose-500"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Fluxo de Caixa (6 meses)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.chartData}>
                                    <defs>
                                        <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" />
                                    <Area type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDespesa)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Comparativo Mensal</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Conheça o Gestor Minds Premium</h3>
                        <p className="opacity-90 max-w-md">Libere relatórios avançados, integração bancária automática e suporte 24/7.</p>
                        <button className="mt-6 px-8 py-3 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95">
                            Ver Planos
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                </div>
            </div>
        </Layout>
    );
};

const Card = ({ title, value, icon, color, textColor }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-3xl shadow-inner`}>
                {icon}
            </div>
            <div>
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                <p className={`text-2xl font-black mt-1 ${textColor || 'text-slate-900 dark:text-white'}`}>{value}</p>
            </div>
        </div>
    </div>
);

export default DashboardPage;
