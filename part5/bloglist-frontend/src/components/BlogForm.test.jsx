import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls the createBlog handler with the right details when a new blog is created', async () => {
    const mockCreateBlog = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const userEventSetup = userEvent.setup()

    await userEventSetup.type(screen.getByLabelText('Title:'), 'New Blog Title')
    await userEventSetup.type(screen.getByLabelText('Author:'), 'New Author')
    await userEventSetup.type(
      screen.getByLabelText('Url:'),
      'http://newblog.com'
    )

    await userEventSetup.click(screen.getByText('save'))

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Author',
      url: 'http://newblog.com',
    })
  })
})
