import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import AccountsPage from './pages/Accounts';
import CategoriesPage from './pages/Categories';
import TransactionsPage from './pages/Transactions';
import PeoplePage from './pages/People';
import CostCentersPage from './pages/CostCenters';
import DashboardPage from './pages/Dashboard';

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
          <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
          <Route path="/people" element={<PrivateRoute><PeoplePage /></PrivateRoute>} />
          <Route path="/cost-centers" element={<PrivateRoute><CostCentersPage /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
