import { test, expect } from '@playwright/test'
import { login, selectPortal } from '../utils/auth-helpers'

test.describe('Portal do Professor - Avaliações', () => {
  test.beforeEach(async ({ page }) => {
    await selectPortal(page, 'professor')
    await login(page, process.env.TEST_TEACHER_EMAIL!, process.env.TEST_TEACHER_PASSWORD!)
  })

  test('deve mostrar lista de avaliações criadas', async ({ page }) => {
    await page.goto('/teacher/assessments')
    await expect(page.getByRole('heading', { name: /avaliações/i })).toBeVisible()
    await expect(page.getByTestId('assessment-list')).toBeVisible()
  })

  test('deve permitir criar nova avaliação', async ({ page }) => {
    await page.goto('/teacher/assessments')
    await page.getByRole('button', { name: /nova avaliação/i }).click()
    
    await page.getByLabel(/título/i).fill('Avaliação de Teste')
    await page.getByLabel(/descrição/i).fill('Descrição da avaliação')
    await page.getByLabel(/curso/i).selectOption({ label: 'Curso de Teste' })
    await page.getByLabel(/data de início/i).fill('2024-03-20')
    await page.getByLabel(/data de término/i).fill('2024-03-27')
    
    // Adiciona questão múltipla escolha
    await page.getByRole('button', { name: /adicionar questão/i }).click()
    await page.getByLabel(/enunciado/i).fill('Qual é a resposta correta?')
    await page.getByLabel(/alternativa a/i).fill('Primeira opção')
    await page.getByLabel(/alternativa b/i).fill('Segunda opção')
    await page.getByLabel(/alternativa c/i).fill('Terceira opção')
    await page.getByLabel(/alternativa d/i).fill('Quarta opção')
    await page.getByLabel(/alternativa correta/i).selectOption('a')
    await page.getByRole('button', { name: /salvar questão/i }).click()
    
    await page.getByRole('button', { name: /criar avaliação/i }).click()
    await expect(page.getByText(/avaliação criada com sucesso/i)).toBeVisible()
  })

  test('deve permitir editar avaliação', async ({ page }) => {
    await page.goto('/teacher/assessments')
    await page.getByTestId('assessment-card').first().getByRole('button', { name: /editar/i }).click()
    
    await page.getByLabel(/título/i).fill('Avaliação Atualizada')
    await page.getByRole('button', { name: /salvar/i }).click()
    
    await expect(page.getByText(/avaliação atualizada com sucesso/i)).toBeVisible()
  })

  test('deve permitir corrigir avaliações', async ({ page }) => {
    await page.goto('/teacher/assessments')
    await page.getByTestId('assessment-card').first().click()
    await page.getByRole('tab', { name: /respostas/i }).click()
    
    await page.getByTestId('student-submission').first().click()
    await page.getByLabel(/nota/i).fill('9.5')
    await page.getByLabel(/feedback/i).fill('Ótimo trabalho!')
    await page.getByRole('button', { name: /salvar correção/i }).click()
    
    await expect(page.getByText(/correção salva com sucesso/i)).toBeVisible()
  })

  test('deve permitir gerar relatório de desempenho', async ({ page }) => {
    await page.goto('/teacher/assessments')
    await page.getByTestId('assessment-card').first().click()
    await page.getByRole('tab', { name: /relatórios/i }).click()
    
    await page.getByRole('button', { name: /gerar relatório/i }).click()
    
    await expect(page.getByTestId('performance-chart')).toBeVisible()
    await expect(page.getByTestId('statistics-table')).toBeVisible()
    
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /exportar pdf/i }).click()
    await downloadPromise
  })

  test('deve permitir configurar critérios de avaliação', async ({ page }) => {
    await page.goto('/teacher/assessments')
    await page.getByTestId('assessment-card').first().click()
    await page.getByRole('tab', { name: /configurações/i }).click()
    
    await page.getByLabel(/nota mínima/i).fill('6.0')
    await page.getByLabel(/peso da prova/i).fill('2')
    await page.getByRole('button', { name: /salvar configurações/i }).click()
    
    await expect(page.getByText(/configurações salvas com sucesso/i)).toBeVisible()
  })
}) 