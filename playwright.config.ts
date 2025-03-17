import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env.test
dotenv.config({ path: './tests/e2e/.env.test' });

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Usa a URL do Vercel em produção/preview ou localhost em desenvolvimento
    baseURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Configurações adicionais para CI
    launchOptions: {
      args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // Configurações específicas para CI
  webServer: process.env.CI ? {
    command: 'pnpm start',
    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  } : undefined,
}); 