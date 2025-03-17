import { test, expect } from '@playwright/test'
import { login, selectPortal } from '../utils/auth-helpers'

test.describe('Portal do Aluno - Avaliações', () => {
  test.beforeEach(async ({ page }) => {
    await selectPortal(page, 'aluno')
    await login(page, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!)
  })

  test('deve mostrar lista de avaliações pendentes', async ({ page }) => {
    await page.goto('/student/assessments')
    await expect(page.getByRole('heading', { name: /avaliações/i })).toBeVisible()
    await expect(page.getByTestId('assessment-list')).toBeVisible()
  })

  test('deve permitir realizar uma avaliação', async ({ page }) => {
    await page.goto('/student/assessments')
    await page.getByTestId('assessment-card').first().click()
    await expect(page.getByRole('heading', { name: /questionário/i })).toBeVisible()
    
    // Responde as questões
    await page.getByTestId('question-1').getByLabel(/alternativa a/i).click()
    await page.getByTestId('question-2').getByLabel(/alternativa b/i).click()
    await page.getByTestId('question-3').getByLabel(/alternativa c/i).click()
    
    await page.getByRole('button', { name: /finalizar avaliação/i }).click()
    await expect(page.getByText(/avaliação enviada com sucesso/i)).toBeVisible()
  })

  test('deve mostrar resultado após finalizar avaliação', async ({ page }) => {
    await page.goto('/student/assessments')
    await page.getByTestId('assessment-card').first().click()
    
    // Responde as questões
    await page.getByTestId('question-1').getByLabel(/alternativa a/i).click()
    await page.getByTestId('question-2').getByLabel(/alternativa b/i).click()
    await page.getByTestId('question-3').getByLabel(/alternativa c/i).click()
    
    await page.getByRole('button', { name: /finalizar avaliação/i }).click()
    await expect(page.getByTestId('assessment-result')).toBeVisible()
    await expect(page.getByTestId('assessment-score')).toBeVisible()
  })

  test('deve permitir visualizar histórico de avaliações', async ({ page }) => {
    await page.goto('/student/assessments/history')
    await expect(page.getByRole('heading', { name: /histórico de avaliações/i })).toBeVisible()
    await expect(page.getByTestId('assessment-history-list')).toBeVisible()
  })

  test('deve permitir visualizar feedback detalhado', async ({ page }) => {
    await page.goto('/student/assessments/history')
    await page.getByTestId('assessment-history-item').first().click()
    await expect(page.getByRole('heading', { name: /feedback/i })).toBeVisible()
    await expect(page.getByTestId('feedback-details')).toBeVisible()
  })
}) 