import { Page } from '@playwright/test'

type PortalType = 'aluno' | 'professor' | 'admin'

export async function selectPortal(page: Page, portal: PortalType) {
  await page.goto('/auth/portal-selection')
  await page.getByRole('link', { name: new RegExp(`portal do ${portal}`, 'i') }).click()
}

export async function login(page: Page, email: string, password: string) {
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/senha/i).fill(password)
  await page.getByRole('button', { name: /entrar/i }).click()
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: /menu/i }).click()
  await page.getByRole('button', { name: /sair/i }).click()
} 