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
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
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
  webServer: process.env.PLAYWRIGHT_TEST_BASE_URL
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe'
      },
}); 