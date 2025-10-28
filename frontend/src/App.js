import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import Analytics from './pages/Analytics';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (allows access even if logged in)
const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/verify-otp" element={
          <PublicRoute>
            <OTPVerification />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-16">
                <Dashboard />
              </main>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/add-job" element={
          <ProtectedRoute>
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-16">
                <AddJob />
              </main>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/edit-job/:id" element={
          <ProtectedRoute>
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-16">
                <EditJob />
              </main>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-16">
                <Analytics />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Default redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
