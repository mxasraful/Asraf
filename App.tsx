import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin
import Login from './admin-panel/Login';
import Dashboard from './admin-panel/Dashboard';

import { LoadingProvider, useLoading } from './context/LoadingContext';
import { DataProvider } from './context/DataContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/admin/login" />;
};

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isInitialLoading } = useLoading();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {!isAdminRoute && !isInitialLoading && <Navbar />}
      <main className="relative flex-grow">
        {children}
      </main>
      {!isAdminRoute && !isInitialLoading && <Footer />}

      <style>{`
        .admin-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          outline: none;
          transition: all 0.2s;
        }
        .dark .admin-input {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        .admin-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        .admin-btn-primary {
          width: 100%;
          padding: 1rem;
          background: #4f46e5;
          color: white;
          font-weight: 700;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .admin-btn-primary:hover {
          background: #4338ca;
        }
        .admin-btn-primary:active {
          transform: scale(0.98);
        }
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <DataProvider>
          <ThemeProvider>
            <Router>
              <LayoutWrapper>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<Login />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback / 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </LayoutWrapper>
            </Router>
          </ThemeProvider>
        </DataProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default App;