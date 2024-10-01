const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Papa TestBear',
        username: 'root',
        password: 'passvoort',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByRole('button', { name: 'login' })
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'passvoort')

      await expect(page.getByText('Papa TestBear is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'wrongpassword')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')

      await expect(
        page.getByText('Papa TestBear is logged in')
      ).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'passvoort')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'TestTitle', 'Test Author', 'www.test.com')

      await expect(page.getByText('TestTitle')).toBeVisible()
    })
  })
})
