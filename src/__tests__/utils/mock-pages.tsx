/**
 * Mock page components for testing navigation
 * These simplified versions of actual pages allow testing navigation without full page implementation
 */

import React from 'react';

export const MockHomePage = () => (
  <div data-testid="home-page">
    <h1>Edunexia LMS</h1>
    <div className="hero-section">
      <h2>Plataforma de Aprendizagem com Inteligência Artificial</h2>
    </div>
    <div className="features-section">
      <h2>Principais Recursos</h2>
    </div>
    <div className="portals-section">
      <h2>Portais</h2>
    </div>
  </div>
);

export const MockPricingPage = () => (
  <div data-testid="pricing-page">
    <h1>Planos e Preços</h1>
    <div className="pricing-plans">
      <div className="plan-card">Plano Básico</div>
      <div className="plan-card">Plano Profissional</div>
      <div className="plan-card">Plano Empresarial</div>
    </div>
  </div>
);

export const MockTestimonialsPage = () => (
  <div data-testid="testimonials-page">
    <h1>Depoimentos</h1>
    <div className="testimonials-grid">
      <div className="testimonial-card" data-testid="testimonial-card">
        <img src="/avatar1.jpg" alt="Avatar" />
        <h3>Nome do Cliente</h3>
        <p>Depoimento do cliente sobre a plataforma.</p>
      </div>
    </div>
  </div>
);

export const MockLoginPage = () => (
  <div data-testid="login-page">
    <h1>Escolha seu Portal</h1>
    <div className="portal-cards">
      <div className="portal-card">
        <h3>Portal do Aluno</h3>
        <a href="/auth/student-login">Acessar Portal</a>
      </div>
      <div className="portal-card">
        <h3>Portal do Professor</h3>
        <a href="/auth/teacher-login">Acessar Portal</a>
      </div>
      <div className="portal-card">
        <h3>Portal Administrativo</h3>
        <a href="/auth/admin-login">Acessar Portal</a>
      </div>
    </div>
  </div>
);

export const MockStudentLoginPage = () => (
  <div data-testid="student-login-page">
    <h1>Portal do Aluno</h1>
    <form>
      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" />
      <label htmlFor="password">Senha</label>
      <input id="password" type="password" />
      <button type="submit">Entrar</button>
    </form>
    <div className="social-login">
      <button>Google</button>
      <button>Microsoft</button>
    </div>
  </div>
);

export const MockTeacherLoginPage = () => (
  <div data-testid="teacher-login-page">
    <h1>Portal do Professor</h1>
    <form>
      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" />
      <label htmlFor="password">Senha</label>
      <input id="password" type="password" />
      <button type="submit">Entrar</button>
    </form>
    <div className="social-login">
      <button>Google</button>
      <button>Microsoft</button>
    </div>
  </div>
);

export const MockAdminLoginPage = () => (
  <div data-testid="admin-login-page">
    <h1>Portal Administrativo</h1>
    <form>
      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" />
      <label htmlFor="password">Senha</label>
      <input id="password" type="password" />
      <button type="submit">Entrar</button>
    </form>
  </div>
);

export const MockStudentDashboardPage = () => (
  <div data-testid="student-dashboard-page">
    <h1>Dashboard do Aluno</h1>
    <div className="dashboard-content">
      <div className="courses-section">Meus Cursos</div>
      <div className="progress-section">Meu Progresso</div>
    </div>
  </div>
);

export const MockTeacherDashboardPage = () => (
  <div data-testid="teacher-dashboard-page">
    <h1>Dashboard do Professor</h1>
    <div className="dashboard-content">
      <div className="courses-section">Meus Cursos</div>
      <div className="students-section">Meus Alunos</div>
    </div>
  </div>
);

export const MockAdminDashboardPage = () => (
  <div data-testid="admin-dashboard-page">
    <h1>Dashboard Administrativo</h1>
    <div className="dashboard-content">
      <div className="stats-section">Estatísticas</div>
      <div className="users-section">Usuários</div>
      <div className="courses-section">Cursos</div>
    </div>
  </div>
);
