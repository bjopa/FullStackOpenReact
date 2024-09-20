import { useState } from "react";

const Blog = ({ blog, updateBlogHandler }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    const newStatus = !isExpanded;
    setIsExpanded(newStatus);
  };

  const addLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    await updateBlogHandler(updatedBlog);
  };

  return (
    <div className="blogStyle">
      {blog.title} by {blog.author}
      <button onClick={toggleExpanded}>{isExpanded ? "hide" : "view"}</button>
      <div style={{ display: isExpanded ? "" : "none" }}>
        {blog.url}
        <br />
        {blog.likes} <button onClick={addLike}>like</button>
        <br />
        {blog.user.name}
      </div>
    </div>
  );
};

export default Blog;
