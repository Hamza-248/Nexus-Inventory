import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { UserList } from './pages/UserList';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';
import { Role } from './types';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: Role | Role[] }> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const hasRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(user!.role)
      : user!.role === requiredRole;
    
    if (!hasRole) {
        // Redirect to dashboard if authorized but wrong role, or login if confused
        return <Navigate to="/" replace />;
    }
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            
            <Route path="/products" element={
                <ProtectedRoute>
                    <ProductList />
                </ProtectedRoute>
            } />
            
            <Route path="/products/:id" element={
                <ProtectedRoute>
                    <ProductDetail />
                </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
                <ProtectedRoute>
                    <Settings />
                </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
                <ProtectedRoute>
                    <Reports />
                </ProtectedRoute>
            } />
            
            <Route path="/users" element={
                <ProtectedRoute requiredRole={Role.ADMIN}>
                    <UserList />
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
            <Router>
            <AppRoutes />
            </Router>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;