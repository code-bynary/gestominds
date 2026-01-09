import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const { user, tenant, logout } = useAuth();

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: '/' },
    { icon: '💸', label: 'Lançamentos', path: '/transactions' },
    { icon: '🏦', label: 'Contas', path: '/accounts' },
    { icon: '📁', label: 'Categorias', path: '/categories' },
    { icon: '📊', label: 'Relatórios', path: '#' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Gestor Minds</h1>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={pathname === item.path}
            />
          ))}

          <div className="pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase">Configurações</div>
          <NavItem icon="👤" label="Perfil" path="#" />
          <NavItem icon="🏢" label="Unidades" path="#" />

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 transition-all mt-8"
          >
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? '◀' : '☰'}
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-slate-500">{tenant?.name || 'Pessoal'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, path, active = false }: { icon: string, label: string, path: string, active?: boolean }) => (
  <Link
    to={path}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active
      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Layout;
