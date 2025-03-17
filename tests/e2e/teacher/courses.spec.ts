import { test, expect } from '@playwright/test'
import { login, selectPortal } from '../utils/auth-helpers'

test.describe('Portal do Professor - Cursos', () => {
  test.beforeEach(async ({ page }) => {
    await selectPortal(page, 'professor')
    await login(page, process.env.TEST_TEACHER_EMAIL!, process.env.TEST_TEACHER_PASSWORD!)
  })

  test('deve mostrar lista de cursos ministrados', async ({ page }) => {
    await page.goto('/teacher/courses')
    await expect(page.getByRole('heading', { name: /meus cursos/i })).toBeVisible()
    await expect(page.getByTestId('course-list')).toBeVisible()
  })

  test('deve permitir criar novo curso', async ({ page }) => {
    await page.goto('/teacher/courses')
    await page.getByRole('button', { name: /novo curso/i }).click()
    
    await page.getByLabel(/título do curso/i).fill('Curso de Teste')
    await page.getByLabel(/descrição/i).fill('Descrição do curso de teste')
    await page.getByLabel(/carga horária/i).fill('40')
    await page.getByRole('button', { name: /criar curso/i }).click()
    
    await expect(page.getByText(/curso criado com sucesso/i)).toBeVisible()
  })

  test('deve permitir editar curso', async ({ page }) => {
    await page.goto('/teacher/courses')
    await page.getByTestId('course-card').first().getByRole('button', { name: /editar/i }).click()
    
    await page.getByLabel(/título do curso/i).fill('Curso Atualizado')
    await page.getByRole('button', { name: /salvar/i }).click()
    
    await expect(page.getByText(/curso atualizado com sucesso/i)).toBeVisible()
  })

  test('deve permitir adicionar aula', async ({ page }) => {
    await page.goto('/teacher/courses')
    await page.getByTestId('course-card').first().click()
    await page.getByRole('button', { name: /nova aula/i }).click()
    
    await page.getByLabel(/título da aula/i).fill('Aula de Teste')
    await page.getByLabel(/descrição/i).fill('Descrição da aula de teste')
    await page.getByLabel(/duração/i).fill('60')
    await page.getByTestId('content-editor').fill('Conteúdo da aula')
    await page.getByRole('button', { name: /adicionar aula/i }).click()
    
    await expect(page.getByText(/aula adicionada com sucesso/i)).toBeVisible()
  })

  test('deve permitir gerenciar material didático', async ({ page }) => {
    await page.goto('/teacher/courses')
    await page.getByTestId('course-card').first().click()
    await page.getByTestId('lesson-item').first().click()
    
    // Upload de material
    const uploadPromise = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: /adicionar material/i }).click()
    const fileChooser = await uploadPromise
    await fileChooser.setFiles(['tests/e2e/fixtures/material.pdf'])
    
    await expect(page.getByText(/material adicionado com sucesso/i)).toBeVisible()
  })

  test('deve permitir responder dúvidas', async ({ page }) => {
    await page.goto('/teacher/courses')
    await page.getByTestId('course-card').first().click()
    await page.getByRole('tab', { name: /dúvidas/i }).click()
    
    await page.getByTestId('question-item').first().click()
    await page.getByLabel(/sua resposta/i).fill('Resposta à dúvida do aluno')
    await page.getByRole('button', { name: /responder/i }).click()
    
    await expect(page.getByText(/resposta enviada com sucesso/i)).toBeVisible()
  })
}) 