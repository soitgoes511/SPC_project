import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import DataSourceList from './pages/DataSourceList';
import DataSourceForm from './pages/DataSourceForm';
import ChartConfigForm from './pages/ChartConfigForm';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Placeholder Components
const Dashboard = () => <h1>Dashboard</h1>;
const SPCCharts = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h1>SPC Charts</h1>
      <Link to="/charts/new" style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}>+ New Chart</Link>
    </div>
  </div>
);

const AdminPanel = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>For advanced configuration, visit the <a href="http://localhost:8000/admin" target="_blank" style={{ color: '#2563eb' }}>Django Admin Interface</a>.</p>
    </div>
  )
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="charts" element={<SPCCharts />} />
            <Route path="charts/new" element={<ChartConfigForm />} />

            <Route path="datasources" element={<DataSourceList />} />
            <Route path="datasources/new" element={<DataSourceForm />} />

            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
