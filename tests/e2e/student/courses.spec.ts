import { test, expect } from '@playwright/test'
import { login, selectPortal } from '../utils/auth-helpers'

test.describe('Portal do Aluno - Cursos', () => {
  test.beforeEach(async ({ page }) => {
    await selectPortal(page, 'aluno')
    await login(page, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!)
  })

  test('deve mostrar lista de cursos matriculados', async ({ page }) => {
    await page.goto('/student/courses')
    await expect(page.getByRole('heading', { name: /meus cursos/i })).toBeVisible()
    await expect(page.getByTestId('course-list')).toBeVisible()
  })

  test('deve permitir acessar um curso', async ({ page }) => {
    await page.goto('/student/courses')
    await page.getByTestId('course-card').first().click()
    await expect(page.getByRole('heading', { name: /conteúdo do curso/i })).toBeVisible()
  })

  test('deve mostrar progresso do curso', async ({ page }) => {
    await page.goto('/student/courses')
    await expect(page.getByTestId('course-progress')).toBeVisible()
  })

  test('deve permitir marcar aula como concluída', async ({ page }) => {
    await page.goto('/student/courses')
    await page.getByTestId('course-card').first().click()
    await page.getByTestId('lesson-item').first().click()
    await page.getByRole('button', { name: /marcar como concluída/i }).click()
    await expect(page.getByTestId('lesson-completed-icon')).toBeVisible()
  })

  test('deve permitir fazer download do material da aula', async ({ page }) => {
    await page.goto('/student/courses')
    await page.getByTestId('course-card').first().click()
    await page.getByTestId('lesson-item').first().click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /baixar material/i }).click()
    await downloadPromise
  })

  test('deve permitir enviar dúvida', async ({ page }) => {
    await page.goto('/student/courses')
    await page.getByTestId('course-card').first().click()
    await page.getByTestId('lesson-item').first().click()
    await page.getByRole('button', { name: /enviar dúvida/i }).click()
    await page.getByLabel(/sua dúvida/i).fill('Tenho uma dúvida sobre o conteúdo')
    await page.getByRole('button', { name: /enviar/i }).click()
    await expect(page.getByText(/dúvida enviada com sucesso/i)).toBeVisible()
  })
}) 