import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState({ type: null, message: null });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showMessage = (messageObject) => {
    setMessage(messageObject);
    setTimeout(() => {
      setMessage({ content: null, type: null });
    }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      showMessage({ type: "error", message: "wrong username or password" });
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await blogService.create({
        author,
        title,
        url,
      });
      setBlogs(blogs.concat(response));
      showMessage({
        type: "success",
        message: `a new blog ${title} by ${author} added`,
      });
    } catch (exception) {
      showMessage({
        type: "error",
        message: exception.message,
      });
    }
  };

  if (!user) {
    return (
      <>
        <h1>log in to application</h1>
        <Notification type={message.type} message={message.message} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification type={message.type} message={message.message} />

      {user && (
        <>
          <div>
            {user.name} logged in
            <button onClick={logout}>logout</button>
          </div>
          <h2>create new</h2>
          <BlogForm
            handleSubmit={handleSubmit}
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setUrl={setUrl}
          />
        </>
      )}
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default App;
