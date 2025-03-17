import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';
import HomePage from './pages/home';
import TestimonialsPage from './pages/testimonials';
import PricingPage from './pages/pricing';
import SupportPage from './pages/support';
import PortalSelectionPage from './pages/auth/portal-selection';
import AdminLoginPage from './pages/auth/admin/login';
import AlunoLoginPage from './pages/auth/aluno/login';
import AlunoRegisterPage from './pages/auth/aluno/register';
import ProfessorLoginPage from './pages/auth/professor/login';
import PoloLoginPage from './pages/auth/polo/login';
import VerifyEmailPage from './pages/auth/verify-email';
import ResetPasswordPage from './pages/auth/reset-password';
import UpdatePasswordPage from './pages/auth/update-password';
import ProfilePage from './pages/profile';
import UnauthorizedPage from './pages/unauthorized';

// Dashboards
import AdminDashboard from './pages/admin/dashboard';
import AlunoDashboard from './pages/aluno/dashboard';
import ProfessorDashboard from './pages/professor/dashboard';
import PoloDashboard from './pages/polo/dashboard';

// Admin Pages
import UsersPage from './pages/admin/users';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              {/* Páginas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/depoimentos" element={<TestimonialsPage />} />
              <Route path="/precos" element={<PricingPage />} />
              <Route path="/suporte" element={<SupportPage />} />
              
              {/* Páginas de autenticação */}
              <Route path="/auth/portal-selection" element={<PortalSelectionPage />} />
              <Route path="/auth/admin/login" element={<AdminLoginPage />} />
              <Route path="/auth/aluno/login" element={<AlunoLoginPage />} />
              <Route path="/auth/aluno/register" element={<AlunoRegisterPage />} />
              <Route path="/auth/professor/login" element={<ProfessorLoginPage />} />
              <Route path="/auth/polo/login" element={<PoloLoginPage />} />
              <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Rotas protegidas */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard Admin */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Pages */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard Aluno */}
              <Route
                path="/aluno/dashboard"
                element={
                  <ProtectedRoute roles={['student']}>
                    <AlunoDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard Professor */}
              <Route
                path="/professor/dashboard"
                element={
                  <ProtectedRoute roles={['teacher']}>
                    <ProfessorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard Polo */}
              <Route
                path="/polo/dashboard"
                element={
                  <ProtectedRoute roles={['polo_manager']}>
                    <PoloDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;