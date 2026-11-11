import { expect, test } from '@playwright/test'

test('landing links to the dashboard', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Steadier sugar')
  await page.getByRole('link', { name: 'Open my dashboard' }).first().click()
  await expect(page.getByText('Care score this week')).toBeVisible()
})

test('a very high reading triggers the doctor alert', async ({ page }) => {
  await page.goto('/app/log')
  await page.getByLabel('Reading').fill('290')
  await page.getByRole('button', { name: 'Upload reading' }).click()
  await expect(page.getByRole('alertdialog')).toContainText('Visit or call')
})