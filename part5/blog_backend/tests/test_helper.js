const User = require("../models/user");
const Blog = require("../models/blog");
const lists = require("./testData/blogList");

const initialBlogs = lists.listWithMultipleBlogs.slice(0, 2);

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "noone",
    url: "notexisting",
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
