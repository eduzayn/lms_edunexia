import { test, expect } from '@playwright/test'
import { login, selectPortal } from '../utils/auth-helpers'

test.describe('Portal do Professor - Material Didático', () => {
  test.beforeEach(async ({ page }) => {
    await selectPortal(page, 'professor')
    await login(page, process.env.TEST_TEACHER_EMAIL!, process.env.TEST_TEACHER_PASSWORD!)
  })

  test('deve mostrar biblioteca de materiais', async ({ page }) => {
    await page.goto('/teacher/materials')
    await expect(page.getByRole('heading', { name: /biblioteca de materiais/i })).toBeVisible()
    await expect(page.getByTestId('materials-grid')).toBeVisible()
  })

  test('deve permitir criar novo material interativo', async ({ page }) => {
    await page.goto('/teacher/materials/new')
    
    // Informações básicas
    await page.getByLabel(/título/i).fill('Material Interativo de Teste')
    await page.getByLabel(/descrição/i).fill('Descrição do material interativo')
    await page.getByLabel(/disciplina/i).selectOption('matemática')
    await page.getByLabel(/série/i).selectOption('1º ano')
    
    // Adiciona elementos interativos
    await page.getByRole('button', { name: /adicionar elemento/i }).click()
    await page.getByRole('button', { name: /texto/i }).click()
    await page.getByTestId('rich-text-editor').fill('# Introdução\nEste é um texto introdutório')
    
    await page.getByRole('button', { name: /adicionar elemento/i }).click()
    await page.getByRole('button', { name: /imagem/i }).click()
    const uploadPromise = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: /escolher arquivo/i }).click()
    const fileChooser = await uploadPromise
    await fileChooser.setFiles(['tests/e2e/fixtures/diagram.png'])
    await page.getByLabel(/legenda/i).fill('Diagrama explicativo')
    
    await page.getByRole('button', { name: /adicionar elemento/i }).click()
    await page.getByRole('button', { name: /vídeo/i }).click()
    await page.getByLabel(/url do vídeo/i).fill('https://youtube.com/watch?v=123')
    
    await page.getByRole('button', { name: /adicionar elemento/i }).click()
    await page.getByRole('button', { name: /quiz/i }).click()
    await page.getByLabel(/pergunta/i).fill('Qual é o resultado de 2 + 2?')
    await page.getByLabel(/alternativa 1/i).fill('3')
    await page.getByLabel(/alternativa 2/i).fill('4')
    await page.getByLabel(/alternativa 3/i).fill('5')
    await page.getByLabel(/alternativa correta/i).selectOption('2')
    
    await page.getByRole('button', { name: /salvar material/i }).click()
    await expect(page.getByText(/material criado com sucesso/i)).toBeVisible()
  })

  test('deve permitir editar material existente', async ({ page }) => {
    await page.goto('/teacher/materials')
    await page.getByTestId('material-card').first().getByRole('button', { name: /editar/i }).click()
    
    await page.getByLabel(/título/i).fill('Material Atualizado')
    await page.getByRole('button', { name: /salvar/i }).click()
    
    await expect(page.getByText(/material atualizado com sucesso/i)).toBeVisible()
  })

  test('deve permitir visualizar prévia do material', async ({ page }) => {
    await page.goto('/teacher/materials')
    await page.getByTestId('material-card').first().getByRole('button', { name: /prévia/i }).click()
    
    await expect(page.getByTestId('material-preview')).toBeVisible()
    await expect(page.getByTestId('interactive-elements')).toBeVisible()
  })

  test('deve permitir compartilhar material', async ({ page }) => {
    await page.goto('/teacher/materials')
    await page.getByTestId('material-card').first().getByRole('button', { name: /compartilhar/i }).click()
    
    // Compartilha com outros professores
    await page.getByLabel(/professores/i).fill('professor@exemplo.com')
    await page.getByRole('button', { name: /compartilhar/i }).click()
    
    await expect(page.getByText(/material compartilhado com sucesso/i)).toBeVisible()
  })

  test('deve permitir criar template de material', async ({ page }) => {
    await page.goto('/teacher/materials')
    await page.getByTestId('material-card').first().getByRole('button', { name: /salvar como template/i }).click()
    
    await page.getByLabel(/nome do template/i).fill('Template de Quiz')
    await page.getByLabel(/categoria/i).selectOption('avaliação')
    await page.getByRole('button', { name: /salvar template/i }).click()
    
    await expect(page.getByText(/template criado com sucesso/i)).toBeVisible()
  })

  test('deve permitir usar template existente', async ({ page }) => {
    await page.goto('/teacher/materials/new')
    await page.getByRole('button', { name: /usar template/i }).click()
    
    await page.getByTestId('template-card').first().click()
    await expect(page.getByText(/template carregado com sucesso/i)).toBeVisible()
    
    // Personaliza o material baseado no template
    await page.getByLabel(/título/i).fill('Novo Material baseado em Template')
    await page.getByRole('button', { name: /salvar material/i }).click()
    
    await expect(page.getByText(/material criado com sucesso/i)).toBeVisible()
  })

  test('deve permitir organizar materiais em pastas', async ({ page }) => {
    await page.goto('/teacher/materials')
    
    // Cria nova pasta
    await page.getByRole('button', { name: /nova pasta/i }).click()
    await page.getByLabel(/nome da pasta/i).fill('Matemática - 1º Ano')
    await page.getByRole('button', { name: /criar pasta/i }).click()
    
    // Move material para a pasta
    await page.getByTestId('material-card').first().dragTo(page.getByTestId('folder-card').first())
    
    await expect(page.getByText(/material movido com sucesso/i)).toBeVisible()
  })
}) 