import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import BiometricAuth from './pages/BiometricAuth';
import Dashboard from './pages/Dashboard';
import AddProvider from './pages/AddProvider';
import ProviderDetail from './pages/ProviderDetail';
import { useStore } from './store/useStore';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<BiometricAuth />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-provider"
            element={
              <PrivateRoute>
                <AddProvider />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/:id"
            element={
              <PrivateRoute>
                <ProviderDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </MobileLayout>
    </Router>
  );
}

export default App;
