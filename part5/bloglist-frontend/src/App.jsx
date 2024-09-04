import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [bannerMessage, setBannerMessage] = useState(null);
  const [bannerType, setBannerType] = useState("info");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

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
      <button style={{ marginLeft: "10px" }} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );

  //BLOGS

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        {user.name} is logged in {logout()}
      </div>
      <br />
      {createBlogForm()}
      <br />

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const newBlog = {
      title,
      author,
      url,
    };
    blogService.create(newBlog).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      setBannerType("info");
      setBannerMessage(
        `A new blog: '${returnedBlog.title}' by ${returnedBlog.author} added`
      );
      setTimeout(() => {
        setBannerMessage(null);
      }, 5000);
    });
  };

  const createBlogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author: </label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="url">URL: </label>
          <input
            type="text"
            id="url"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );

  return (
    <div>
      <Notification message={bannerMessage} type={bannerType} />
      {user === null ? loginForm() : blogForm()}
    </div>
  );
};

export default App;
