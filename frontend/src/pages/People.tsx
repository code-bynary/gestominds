import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

interface Person {
    id: string;
    name: string;
    document?: string;
    email?: string;
    phone?: string;
}

const PeoplePage: React.FC = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        document: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        try {
            const response = await api.get('/people');
            setPeople(response.data);
        } catch (err) {
            console.error('Erro ao buscar pessoas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/people', formData);
            setIsModalOpen(false);
            setFormData({ name: '', document: '', email: '', phone: '' });
            fetchPeople();
        } catch (err) {
            console.error('Erro ao criar pessoa:', err);
        }
    };

    const deletePerson = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return;
        try {
            await api.delete(`/people/${id}`);
            fetchPeople();
        } catch (err) {
            console.error('Erro ao excluir pessoa:', err);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Pessoas</h2>
                        <p className="text-slate-500 mt-2">Gerencie seus clientes, fornecedores e parceiros.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 transition-all active:scale-95"
                    >
                        + Nova Pessoa
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {people.map((person) => (
                            <div key={person.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative group">
                                <button
                                    onClick={() => deletePerson(person.id)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 text-xl font-bold">
                                        {person.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{person.name}</h3>
                                        <p className="text-xs text-slate-500">{person.document || 'Sem documento'}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                        <span className="mr-2">📧</span> {person.email || 'Não informado'}
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                        <span className="mr-2">📞</span> {person.phone || 'Não informado'}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button className="w-full py-2 text-primary-600 dark:text-primary-400 font-semibold text-sm border border-primary-100 dark:border-primary-900/30 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
                                        Ver histórico
                                    </button>
                                </div>
                            </div>
                        ))}
                        {people.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500">Nenhuma pessoa cadastrada ainda.</p>
                            </div>
                        )}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-2xl font-bold mb-6">Nova Pessoa</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nome completo / Razão Social</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Ex: João da Silva ou Empresa LTDA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">CPF / CNPJ</label>
                                    <input
                                        type="text"
                                        value={formData.document}
                                        onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="contato@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <div className="flex space-x-4 pt-6">
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

export default PeoplePage;
