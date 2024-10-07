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
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Second User',
        username: 'sec',
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

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable Blog', 'Test Author', 'www.likeable.com')

      await expect(page.getByText('Likeable Blog')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(
        page,
        'Deleteable Blog',
        'Test Author',
        'www.deleteable.com'
      )

      await expect(page.getByText('Deleteable Blog')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toBe(
          "Remove blog 'Deleteable Blog' by 'Test Author'?"
        )
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Deleteable Blog')).not.toBeVisible()
    })

    test('only the creator can see the remove button', async ({ page }) => {
      await createBlog(
        page,
        'No remove button',
        'Test Author One',
        'www.removemenot.com'
      )

      await expect(page.getByText('No remove button')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'Logout' }).click()
      await loginWith(page, 'sec', 'passvoort')

      await expect(page.getByText('No remove button')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })

    test('blogs are ordered by likes, most likes first', async ({ page }) => {
      await createBlog(page, 'First Blog', 'Author 1', 'www.first.com')
      await createBlog(page, 'Second Blog', 'Author 2', 'www.second.com')
      await createBlog(page, 'Third Blog', 'Author 3', 'www.third.com')

      const likeBlog = async (blogTitle, likes) => {
        await page
          .getByText(blogTitle)
          .getByRole('button', { name: 'view' })
          .click()

        for (let i = 0; i < likes; i++) {
          await page
            .getByText(blogTitle)
            .getByRole('button', { name: 'like' })
            .click()
        }

        await page
          .getByText(blogTitle)
          .getByRole('button', { name: 'hide' })
          .click()
      }

      await likeBlog('First Blog', 3)
      await likeBlog('Second Blog', 5)
      await likeBlog('Third Blog', 2)

      const blogTitles = await page
        .locator('.blogStyle')
        .evaluateAll((blogs) => blogs.map((blog) => blog.textContent))

      console.log('Order of blogs:', blogTitles)

      expect(blogTitles[0]).toContain('Second Blog')
      expect(blogTitles[1]).toContain('First Blog')
      expect(blogTitles[2]).toContain('Third Blog')
    })
  })
})
