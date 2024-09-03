import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Check logged-in user from local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
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
      console.log("Wrong Credentials");
    }
  };

  const handleLogout = async (event) => {
    setUser(null);
    window.localStorage.removeItem("loggedNoteappUser");
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

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} is logged in </p>
      {logout()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  return <div>{user === null ? loginForm() : blogForm()}</div>;
};

export default App;
