import { Page, expect } from '@playwright/test';

export async function login(page: Page, email = process.env.TEST_USER_EMAIL || 'test@example.com', password = process.env.TEST_USER_PASSWORD || 'password123') {
  await page.waitForLoadState('networkidle');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL(/\/dashboard/);
  await page.waitForLoadState('networkidle');
}

export async function logout(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await expect(page).toHaveURL('/auth/portal-selection');
  await page.waitForLoadState('networkidle');
}

export async function selectPortal(page: Page) {
  await page.waitForLoadState('networkidle');
  const portalButtons = page.locator('button');
  await expect(portalButtons).toHaveCount(4, { timeout: 30000 });
  await expect(portalButtons.first()).toBeVisible();
  await portalButtons.first().click();
  await expect(page).toHaveURL(/\/auth\/login/);
  await page.waitForLoadState('networkidle');
} 