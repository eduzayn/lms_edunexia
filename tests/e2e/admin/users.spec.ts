import { test, expect } from '@playwright/test'
import { login, selectPortal } from '../utils/auth-helpers'

test.describe('Portal Administrativo - Usuários', () => {
  test.beforeEach(async ({ page }) => {
    await selectPortal(page, 'admin')
    await login(page, process.env.TEST_ADMIN_EMAIL!, process.env.TEST_ADMIN_PASSWORD!)
  })

  test('deve mostrar lista de usuários', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page.getByRole('heading', { name: /usuários/i })).toBeVisible()
    await expect(page.getByTestId('user-list')).toBeVisible()
  })

  test('deve permitir criar novo usuário', async ({ page }) => {
    await page.goto('/admin/users')
    await page.getByRole('button', { name: /novo usuário/i }).click()
    
    await page.getByLabel(/nome/i).fill('João Silva')
    await page.getByLabel(/email/i).fill('joao.silva@exemplo.com')
    await page.getByLabel(/tipo de usuário/i).selectOption('student')
    await page.getByLabel(/status/i).selectOption('active')
    await page.getByRole('button', { name: /criar usuário/i }).click()
    
    await expect(page.getByText(/usuário criado com sucesso/i)).toBeVisible()
  })

  test('deve permitir editar usuário', async ({ page }) => {
    await page.goto('/admin/users')
    await page.getByTestId('user-row').first().getByRole('button', { name: /editar/i }).click()
    
    await page.getByLabel(/nome/i).fill('João Silva Atualizado')
    await page.getByRole('button', { name: /salvar/i }).click()
    
    await expect(page.getByText(/usuário atualizado com sucesso/i)).toBeVisible()
  })

  test('deve permitir desativar usuário', async ({ page }) => {
    await page.goto('/admin/users')
    await page.getByTestId('user-row').first().getByRole('button', { name: /desativar/i }).click()
    
    await page.getByRole('button', { name: /confirmar/i }).click()
    
    await expect(page.getByText(/usuário desativado com sucesso/i)).toBeVisible()
  })

  test('deve permitir gerenciar permissões', async ({ page }) => {
    await page.goto('/admin/users')
    await page.getByTestId('user-row').first().getByRole('button', { name: /permissões/i }).click()
    
    await page.getByLabel(/gerenciar cursos/i).check()
    await page.getByLabel(/gerenciar avaliações/i).check()
    await page.getByRole('button', { name: /salvar permissões/i }).click()
    
    await expect(page.getByText(/permissões atualizadas com sucesso/i)).toBeVisible()
  })

  test('deve permitir visualizar logs de atividade', async ({ page }) => {
    await page.goto('/admin/users')
    await page.getByTestId('user-row').first().getByRole('button', { name: /logs/i }).click()
    
    await expect(page.getByRole('heading', { name: /logs de atividade/i })).toBeVisible()
    await expect(page.getByTestId('activity-log-list')).toBeVisible()
  })

  test('deve permitir exportar relatório de usuários', async ({ page }) => {
    await page.goto('/admin/users')
    
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /exportar/i }).click()
    await downloadPromise
  })
}) 