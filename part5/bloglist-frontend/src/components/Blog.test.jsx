import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' },
  }

  const user = {
    username: 'testuser',
  }

  test("renders the blog's title and author, but not the URL or likes by default", () => {
    render(
      <Blog
        blog={blog}
        user={user}
      />
    )

    expect(
      screen.getByText(`${blog.title} by ${blog.author}`)
    ).toBeInTheDocument()
    expect(screen.queryByText(blog.url)).not.toBeVisible()
    expect(screen.queryByText(blog.likes.toString())).not.toBeVisible()
  })

  test("shows the blog's URL and likes when view button is clicked", async () => {
    render(
      <Blog
        blog={blog}
        user={user}
      />
    )

    const userEventSetup = userEvent.setup()
    const button = screen.getByText('view')
    await userEventSetup.click(button)

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(blog.likes.toString())).toBeVisible()
  })

  test('calls the handler twice when the like button is clicked twice', async () => {
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlogHandler={mockHandler}
      />
    )

    const userEventSetup = userEvent.setup()
    const viewButton = screen.getByText('view')
    await userEventSetup.click(viewButton)

    const likeButton = screen.getByText('like')
    await userEventSetup.click(likeButton)
    await userEventSetup.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
