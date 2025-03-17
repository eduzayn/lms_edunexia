import { Page, expect } from '@playwright/test';

export async function login(
  page: Page,
  email = process.env.TEST_USER_EMAIL || 'test@example.com',
  password = process.env.TEST_USER_PASSWORD || 'password123'
) {
  console.log('Iniciando login...');
  await page.waitForLoadState('networkidle');
  
  // Aguarda e preenche o email
  const emailInput = page.getByLabel('Email');
  await emailInput.waitFor({ state: 'visible', timeout: 30000 });
  await emailInput.fill(email);
  
  // Aguarda e preenche a senha
  const passwordInput = page.getByLabel('Senha');
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.fill(password);
  
  // Clica no botão de login
  const loginButton = page.getByRole('button', { name: /entrar/i });
  await loginButton.waitFor({ state: 'visible' });
  await loginButton.click();
  
  // Aguarda redirecionamento
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
  await page.waitForLoadState('networkidle');
  console.log('Login concluído com sucesso');
}

export async function logout(page: Page) {
  console.log('Iniciando logout...');
  await page.waitForLoadState('networkidle');
  
  // Abre o menu do usuário
  const userMenu = page.getByRole('button', { name: /menu do usuário/i });
  await userMenu.waitFor({ state: 'visible', timeout: 30000 });
  await userMenu.click();
  
  // Clica no botão de logout
  const logoutButton = page.getByRole('button', { name: /sair/i });
  await logoutButton.waitFor({ state: 'visible' });
  await logoutButton.click();
  
  // Aguarda redirecionamento
  await expect(page).toHaveURL('/auth/portal-selection', { timeout: 30000 });
  await page.waitForLoadState('networkidle');
  console.log('Logout concluído com sucesso');
}

export async function selectPortal(page: Page) {
  console.log('Selecionando portal...');
  await page.waitForLoadState('networkidle');
  
  // Aguarda os botões dos portais
  const portalButtons = page.getByRole('button');
  await expect(portalButtons).toHaveCount(4, { timeout: 30000 });
  
  // Seleciona o primeiro portal
  const firstPortal = portalButtons.first();
  await firstPortal.waitFor({ state: 'visible' });
  await firstPortal.click();
  
  // Aguarda redirecionamento
  await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30000 });
  await page.waitForLoadState('networkidle');
  console.log('Portal selecionado com sucesso');
} 