import { test, expect } from '@playwright/test'
import { login, logout, selectPortal } from '../utils/auth-helpers'

test.describe('Autenticação', () => {
  test('deve mostrar a página de seleção de portal', async ({ page }) => {
    await page.goto('/auth/portal-selection')
    await expect(page.getByRole('heading', { name: /escolha seu portal/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /portal do aluno/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /portal do professor/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /portal administrativo/i })).toBeVisible()
  })

  test('deve permitir selecionar portal do aluno e fazer login', async ({ page }) => {
    await selectPortal(page, 'aluno')
    await login(page, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!)
    await expect(page.getByText(/bem vindo/i)).toBeVisible()
  })

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await selectPortal(page, 'aluno')
    await login(page, 'email@invalido.com', 'senha123')
    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible()
  })

  test('deve permitir fazer logout', async ({ page }) => {
    await selectPortal(page, 'aluno')
    await login(page, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!)
    await logout(page)
    await expect(page.url()).toContain('/auth/portal-selection')
  })

  test('deve redirecionar usuário não autenticado', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.url()).toContain('/auth/portal-selection')
  })
}) 