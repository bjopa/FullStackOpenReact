import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [bannerMessage, setBannerMessage] = useState(null);
  const [bannerType, setBannerType] = useState("info");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();
  const [blogs, setBlogs] = useState([]);

  // Check logged-in user from local storage when page is refreshed
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, []);

  // //Initial Blogs after logging in
  useEffect(() => {
    if (user !== null) blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [user]);

  //USER
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setBannerType("error");
      setBannerMessage("Wrong credentials");
      setTimeout(() => {
        setBannerMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    setUser(null);
    window.localStorage.clear();
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const logout = () => (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );

  //BLOGS

  const updateBlog = async (blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(
        blogToUpdate.id,
        blogToUpdate
      );
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      );
    } catch (exception) {
      setBannerType("error");
      setBannerMessage("Could not update, read error description in console");
      console.log(exception);
      setTimeout(() => {
        setBannerMessage(null);
      }, 5000);
    }
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
    });
  };

  const blogSection = () => (
    <div>
      <h2>blogs</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        {user.name} is logged in {logout()}
      </div>
      <br />
      <Togglable buttonLabel="create" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br />

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlogHandler={updateBlog} />
      ))}
    </div>
  );

  //RETURN

  return (
    <div>
      <Notification message={bannerMessage} type={bannerType} />
      {user === null ? loginForm() : blogSection()}
    </div>
  );
};

export default App;
