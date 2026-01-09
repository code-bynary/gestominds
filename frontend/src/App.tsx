import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import AccountsPage from './pages/Accounts';
import Layout from './components/Layout';

function Dashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Bem-vindo, Fabio!</h2>
          <p className="text-slate-500 mt-2">Aqui está o resumo do seu patrimônio hoje.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card title="Saldo Total" value="R$ 12.450,00" trend="+2.4%" positive icon="💰" />
          <Card title="Receitas (Mês)" value="R$ 8.200,00" trend="+12%" positive icon="📈" />
          <Card title="Despesas (Mês)" value="R$ 3.850,00" trend="-5%" positive icon="📉" />
          <Card title="Investimentos" value="R$ 45.000,00" trend="+0.8%" positive icon="🏦" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Últimas Movimentações</h3>
          <div className="space-y-4">
            <TransactionItem title="Supermercado Extra" category="Alimentação" amount="- R$ 450,00" date="Hoje" />
            <TransactionItem title="Salário Mensal" category="Receita" amount="+ R$ 6.500,00" date="Ontem" positive />
            <TransactionItem title="Netflix" category="Assinaturas" amount="- R$ 55,90" date="08 Jan" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

const Card = ({ title, value, trend, positive, icon }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <span className={`text-sm font-medium ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
  </div>
);

const TransactionItem = ({ title, category, amount, date, positive }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex items-center space-x-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${positive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
        {positive ? '↓' : '↑'}
      </div>
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500">{category}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`font-bold ${positive ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>{amount}</p>
      <p className="text-xs text-slate-400">{date}</p>
    </div>
  </div>
);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  // For demo purposes, we will treat it as authenticated if "user" exists in localStorage
  const isDemoAuth = localStorage.getItem('user') !== null;
  return isDemoAuth || isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/accounts" element={<PrivateRoute><AccountsPage /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
