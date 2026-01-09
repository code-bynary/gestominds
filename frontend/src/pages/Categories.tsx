import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    parentId?: string;
    children?: Category[];
}

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: '', type: 'EXPENSE', parentId: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Erro ao buscar categorias:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/categories', {
                ...newCategory,
                parentId: newCategory.parentId || undefined
            });
            setIsModalOpen(false);
            setNewCategory({ name: '', type: 'EXPENSE', parentId: '' });
            fetchCategories();
        } catch (err) {
            console.error('Erro ao criar categoria:', err);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('Tem certeza? Isso pode afetar lançamentos vinculados (se existirem).')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            alert('Erro ao excluir: verifique se não existem subcategorias vinculadas.');
        }
    };

    const CategoryItem = ({ category, level = 0 }: { category: Category, level?: number }) => (
        <div className="group">
            <div className={`flex items-center justify-between p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all ${level === 0 ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-2' : 'ml-8 border-l-2 border-slate-100 dark:border-slate-800'}`}>
                <div className="flex items-center space-x-3">
                    <span className={`w-2 h-2 rounded-full ${category.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <span className={`font-semibold ${level === 0 ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                        {category.name}
                    </span>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => {
                            setNewCategory({ ...newCategory, parentId: category.id, type: category.type });
                            setIsModalOpen(true);
                        }}
                        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg text-sm"
                    >
                        + Sub
                    </button>
                    <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                    >
                        ✕
                    </button>
                </div>
            </div>
            {category.children?.map(child => (
                <CategoryItem key={child.id} category={child} level={level + 1} />
            ))}
        </div>
    );

    const incomeCategories = categories.filter(c => c.type === 'INCOME');
    const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Categorias</h2>
                        <p className="text-slate-500 mt-2">Personalize sua classificação financeira.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 transition-all active:scale-95"
                    >
                        + Nova Categoria
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Receitas */}
                        <section>
                            <h3 className="text-lg font-bold text-emerald-600 mb-6 flex items-center">
                                <span className="mr-2">📈</span> Receitas
                            </h3>
                            <div className="space-y-4">
                                {incomeCategories.map(cat => <CategoryItem key={cat.id} category={cat} />)}
                                {incomeCategories.length === 0 && <p className="text-slate-400 text-sm">Nenhuma categoria de receita.</p>}
                            </div>
                        </section>

                        {/* Despesas */}
                        <section>
                            <h3 className="text-lg font-bold text-rose-600 mb-6 flex items-center">
                                <span className="mr-2">📉</span> Despesas
                            </h3>
                            <div className="space-y-4">
                                {expenseCategories.map(cat => <CategoryItem key={cat.id} category={cat} />)}
                                {expenseCategories.length === 0 && <p className="text-slate-400 text-sm">Nenhuma categoria de despesa.</p>}
                            </div>
                        </section>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-2xl font-bold mb-6">{newCategory.parentId ? 'Nova Subcategoria' : 'Nova Categoria'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nome</label>
                                    <input
                                        type="text"
                                        required
                                        autoFocus
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Ex: Alimentação, Salário..."
                                    />
                                </div>
                                {!newCategory.parentId && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Tipo</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setNewCategory({ ...newCategory, type: 'INCOME' })}
                                                className={`py-3 rounded-xl border-2 font-bold transition-all ${newCategory.type === 'INCOME' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400'}`}
                                            >
                                                Receita
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewCategory({ ...newCategory, type: 'EXPENSE' })}
                                                className={`py-3 rounded-xl border-2 font-bold transition-all ${newCategory.type === 'EXPENSE' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 text-slate-400'}`}
                                            >
                                                Despesa
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setNewCategory({ name: '', type: 'EXPENSE', parentId: '' });
                                        }}
                                        className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all"
                                    >
                                        Salvar
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

export default CategoriesPage;
