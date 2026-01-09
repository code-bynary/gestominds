import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd call an API here. Let's simulate:
        console.log('Logging in with:', email, password);
        // login({ user: { id: '1', name: 'Fabio', email }, tenant: { id: 't1', name: 'Meu Financeiro' }, accessToken: '...', refreshToken: '...' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400">Gestor Minds</h2>
                    <p className="text-slate-500 mt-2">Bem-vindo de volta!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98]"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Não tem uma conta? <a href="#" className="font-bold text-primary-600">Cadastre-se</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
