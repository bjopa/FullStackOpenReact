import { useState } from 'react'

const Blog = ({ blog, user, updateBlogHandler, deleteBlogHandler }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    const newStatus = !isExpanded
    setIsExpanded(newStatus)
  }

  const addLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
    }
    await updateBlogHandler(updatedBlog)
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog '${blog.title}' by '${blog.author}'?`)) {
      await deleteBlogHandler(blog)
    }
  }

  return (
    <div className="blogStyle">
      Title: {blog.title} by {blog.author}
      <button onClick={toggleExpanded}>{isExpanded ? 'hide' : 'view'}</button>
      <div style={{ display: isExpanded ? '' : 'none' }}>
        <div>URL: {blog.url}</div>
        <div>
          <span data-testid="likes-count">Likes: {blog.likes || 0}</span>
          <button onClick={addLike}>like</button>
        </div>
        <div>
          Author:{' '}
          {blog.user && blog.user.name ? blog.user.name : 'Unknown user'}
        </div>
        <div>
          {blog.user.username === user.username ? (
            <button
              className="removeButton"
              onClick={deleteBlog}
            >
              remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Blog
