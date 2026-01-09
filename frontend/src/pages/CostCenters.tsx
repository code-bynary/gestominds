import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

interface CostCenter {
    id: string;
    name: string;
}

const CostCentersPage: React.FC = () => {
    const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCostCenters();
    }, []);

    const fetchCostCenters = async () => {
        try {
            const response = await api.get('/cost-centers');
            setCostCenters(response.data);
        } catch (err) {
            console.error('Erro ao buscar centros de custo:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/cost-centers/${editingId}`, formData);
            } else {
                await api.post('/cost-centers', formData);
            }
            setIsModalOpen(false);
            setFormData({ name: '' });
            setEditingId(null);
            fetchCostCenters();
        } catch (err) {
            console.error('Erro ao salvar centro de custo:', err);
        }
    };

    const handleEdit = (item: CostCenter) => {
        setEditingId(item.id);
        setFormData({ name: item.name });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este centro de custo?')) return;
        try {
            await api.delete(`/cost-centers/${id}`);
            fetchCostCenters();
        } catch (err) {
            console.error('Erro ao excluir centro de custo:', err);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Centros de Custo</h2>
                        <p className="text-slate-500 mt-2">Gerencie seus projetos e departamentos.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ name: '' });
                            setIsModalOpen(true);
                        }}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                    >
                        + Novo Centro de Custo
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {costCenters.map((cc) => (
                            <div key={cc.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cc.name}</h3>
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(cc)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cc.id)}
                                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {costCenters.length === 0 && !loading && (
                    <div className="py-20 text-center text-slate-400">
                        Nenhum centro de custo cadastrado.
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold mb-6">{editingId ? 'Editar' : 'Novo'} Centro de Custo</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nome do Centro de Custo</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ex: Marketing, Projeto X, Administrativo..."
                                    />
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
                                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
                                    >
                                        {editingId ? 'Salvar Alterações' : 'Criar Centro'}
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

export default CostCentersPage;
