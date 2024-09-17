const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { test, after, beforeEach, describe } = require("node:test");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("When there is some blogs saved initially", () => {
  let token;

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const user = new User({
      username: "root",
      passwordHash: await bcrypt.hash("sekret", 10),
    });
    await user.save();

    const userForToken = {
      username: user.username,
      id: user._id,
    };
    token = jwt.sign(userForToken, process.env.SECRET);

    const blogObjects = helper.initialBlogs.map((blog) => {
      return new Blog({
        ...blog,
        user: user._id,
      });
    });

    const blogArray = blogObjects.map((blog) => blog.save());
    await Promise.all(blogArray);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("blogs unique identifier is ID", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);
    const blogs = response.body;

    blogs.forEach((blog) => {
      assert(blog.id !== undefined);
      assert(blog._id === undefined);
    });
  });

  describe("Addition of a new blog", () => {
    test("blog is created successfully with token", async () => {
      const responseBefore = await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`);
      const blogCountBeforeAdding = responseBefore.body.length;

      const newBlog = {
        title: "TestBlog",
        author: "Author McTest",
        url: "testurl.com",
        likes: 99,
      };

      const addedBlog = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      responseAfter = await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`);
      const blogCountAfterAdding = responseAfter.body.length;

      assert.strictEqual(newBlog.title, addedBlog.body.title);
      assert.strictEqual(newBlog.author, addedBlog.body.author);
      assert.strictEqual(newBlog.url, addedBlog.body.url);
      assert.strictEqual(newBlog.likes, addedBlog.body.likes);
      assert.strictEqual(blogCountBeforeAdding + 1, blogCountAfterAdding);
    });

    test("blog likes defaults to zero if missing", async () => {
      const newBlog = {
        title: "TestBlog",
        author: "Author McTest",
        url: "testurl.com",
        //no likes
      };

      const addedBlog = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(addedBlog.body.likes, 0);
    });

    test("blog returns error code 400 if title is missing", async () => {
      const newBlog = {
        //no title
        author: "Author McTest",
        url: "notitle.com",
        likes: 99,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });

    test("blog returns error code 400 if url is missing", async () => {
      const newBlog = {
        title: "Test URL missing",
        author: "Author McTest",
        //no url
        likes: 99,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });

    test("blog returns error code 401 if token is missing", async () => {
      const newBlog = {
        title: "Test Blog",
        author: "Author McTest",
        url: "testurl.com",
        likes: 99,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);
    });
  });

  describe("Updating a specific blog", () => {
    test("likes is updated successsfully", async () => {
      const putResponse = await api
        .put("/api/blogs/5a422aa71b54a676234d17f8")
        .set("Authorization", `Bearer ${token}`)
        .send({ likes: 666 })
        .expect(200);

      const responseAfterUpdate = await api
        .get("/api/blogs/5a422aa71b54a676234d17f8")
        .set("Authorization", `Bearer ${token}`);

      const likesAfterUpdate = responseAfterUpdate.body.likes;

      assert.strictEqual(putResponse.body.likes, likesAfterUpdate);
    });
  });

  describe("Deleting a specific blog", () => {
    test("blog is deleted successfully", async () => {
      const responseBefore = await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`);
      const blogCountBeforeDeleting = responseBefore.body.length;

      await api
        .delete("/api/blogs/5a422aa71b54a676234d17f8")
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const responseAfter = await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`);
      const blogCountAfterDeleting = responseAfter.body.length;

      assert.strictEqual(blogCountBeforeDeleting - 1, blogCountAfterDeleting);
    });
  });
});

describe("When there us initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Fresh One",
      name: "Kalle Anka",
      password: "passvoort",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser Failing",
      password: "passvoort",
    };

    const result = await api
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username is shorter than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "un",
      name: "Superuser Failing",
      password: "passvoort",
    };

    const result = await api
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("shorter than the minimum allowed length")
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is shorter than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "username",
      name: "Superuser Failing",
      password: "pw",
    };

    const result = await api
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("password does not meet minimum"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
