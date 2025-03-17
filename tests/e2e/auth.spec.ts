import { test, expect } from '@playwright/test';
import { login, logout, selectPortal } from './helpers/auth';

test.describe('Autenticação e Seleção de Portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/portal-selection');
    await page.waitForLoadState('networkidle');
  });

  test('deve mostrar a página de seleção de portal', async ({ page }) => {
    // Verifica se o título está visível
    await expect(page.locator('h1')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('h1')).toHaveText('Selecione o Portal');

    // Verifica se os botões dos portais estão visíveis
    const portalButtons = page.locator('button');
    await expect(portalButtons).toHaveCount(4);
    await expect(portalButtons.first()).toBeVisible();

    // Tira um screenshot para referência
    await page.screenshot({ path: 'portal-selection.png' });
  });

  test('deve permitir selecionar um portal', async ({ page }) => {
    await selectPortal(page);
  });

  test('deve permitir fazer login', async ({ page }) => {
    await selectPortal(page);
    await login(page);
  });

  test('deve permitir fazer logout', async ({ page }) => {
    await selectPortal(page);
    await login(page);
    await logout(page);
  });
}); 