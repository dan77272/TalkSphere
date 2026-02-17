import { test, expect } from '@playwright/test';

test.describe('Main Page', () => {
    test('renders hero & CTA', async ({page}) => {
        await page.goto('http://localhost:3000/')
        await expect(page.getByTestId('logo')).toBeVisible()
        await expect(page.getByText('Talk to Strangers!', {exact: true})).toBeVisible()
        const cta = page.getByRole('button', {name: 'Text'})
        await expect(cta).toBeVisible()
        await expect(cta).toBeEnabled()
    })

    test('shows online count from API', async ({page}) => {
        await page.route('**/api/stats', route => 
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({usersOnline: 7})
            })
        )

        await page.goto('http://localhost:3000/')
        await expect(page.getByTestId('online-count')).toContainText('7')
    })
})