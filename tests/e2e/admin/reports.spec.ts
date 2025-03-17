import { test, expect } from '@playwright/test'
import { login, selectPortal } from '../utils/auth-helpers'

test.describe('Portal Administrativo - Relatórios', () => {
  test.beforeEach(async ({ page }) => {
    await selectPortal(page, 'admin')
    await login(page, process.env.TEST_ADMIN_EMAIL!, process.env.TEST_ADMIN_PASSWORD!)
  })

  test('deve mostrar dashboard com métricas gerais', async ({ page }) => {
    await page.goto('/admin/reports/dashboard')
    
    await expect(page.getByTestId('total-users-card')).toBeVisible()
    await expect(page.getByTestId('active-courses-card')).toBeVisible()
    await expect(page.getByTestId('completion-rate-card')).toBeVisible()
    await expect(page.getByTestId('revenue-card')).toBeVisible()
  })

  test('deve permitir gerar relatório de desempenho acadêmico', async ({ page }) => {
    await page.goto('/admin/reports/academic')
    
    await page.getByLabel(/período/i).selectOption('2024-1')
    await page.getByLabel(/curso/i).selectOption('todos')
    await page.getByRole('button', { name: /gerar relatório/i }).click()
    
    await expect(page.getByTestId('academic-performance-chart')).toBeVisible()
    await expect(page.getByTestId('course-completion-table')).toBeVisible()
    await expect(page.getByTestId('assessment-stats')).toBeVisible()
    
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /exportar pdf/i }).click()
    await downloadPromise
  })

  test('deve permitir gerar relatório financeiro', async ({ page }) => {
    await page.goto('/admin/reports/financial')
    
    await page.getByLabel(/data inicial/i).fill('2024-01-01')
    await page.getByLabel(/data final/i).fill('2024-03-20')
    await page.getByRole('button', { name: /gerar relatório/i }).click()
    
    await expect(page.getByTestId('revenue-chart')).toBeVisible()
    await expect(page.getByTestId('transactions-table')).toBeVisible()
    await expect(page.getByTestId('summary-stats')).toBeVisible()
    
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /exportar excel/i }).click()
    await downloadPromise
  })

  test('deve permitir gerar relatório de engajamento', async ({ page }) => {
    await page.goto('/admin/reports/engagement')
    
    await page.getByLabel(/período/i).selectOption('últimos 30 dias')
    await page.getByRole('button', { name: /gerar relatório/i }).click()
    
    await expect(page.getByTestId('daily-active-users-chart')).toBeVisible()
    await expect(page.getByTestId('content-engagement-chart')).toBeVisible()
    await expect(page.getByTestId('user-retention-table')).toBeVisible()
  })

  test('deve permitir configurar relatórios automáticos', async ({ page }) => {
    await page.goto('/admin/reports/settings')
    
    await page.getByLabel(/relatório acadêmico/i).check()
    await page.getByLabel(/frequência/i).selectOption('mensal')
    await page.getByLabel(/destinatários/i).fill('coordenacao@exemplo.com')
    await page.getByRole('button', { name: /salvar configurações/i }).click()
    
    await expect(page.getByText(/configurações salvas com sucesso/i)).toBeVisible()
  })

  test('deve permitir visualizar histórico de relatórios', async ({ page }) => {
    await page.goto('/admin/reports/history')
    
    await expect(page.getByRole('heading', { name: /histórico de relatórios/i })).toBeVisible()
    await expect(page.getByTestId('report-history-table')).toBeVisible()
    
    await page.getByTestId('report-row').first().click()
    await expect(page.getByTestId('report-details')).toBeVisible()
  })
}) 