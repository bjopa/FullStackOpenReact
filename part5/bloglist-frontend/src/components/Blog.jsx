import { useState } from "react";

const Blog = ({ blog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    const newStatus = !isExpanded;
    setIsExpanded(newStatus);
  };

  return (
    <div className="blogStyle">
      {blog.title} by {blog.author}
      <button onClick={toggleExpanded}>{isExpanded ? "hide" : "view"}</button>
      <div style={{ display: isExpanded ? "" : "none" }}>
        {blog.url}
        <br />
        {blog.likes} <button>like</button>
        <br />
        {blog.user.name}
      </div>
    </div>
  );
};

export default Blog;
