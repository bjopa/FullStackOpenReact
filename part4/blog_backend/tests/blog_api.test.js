const { test, after, beforeEach, describe } = require("node:test");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("When there is some blogs saved initially", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("blogs unique identifier is ID", async () => {
    const response = await api.get("/api/blogs");
    const blogs = response.body;

    blogs.forEach((blog) => {
      assert(blog.id !== undefined);
      assert(blog._id === undefined);
    });
  });

  describe("Addition of a new blog", () => {
    test("blog is created successfully", async () => {
      const responseBefore = await api.get("/api/blogs");
      const blogCountBeforeAdding = responseBefore.body.length;

      const newBlog = {
        title: "TestBlog",
        author: "Author McTest",
        url: "testurl.com",
        likes: 99,
      };

      const addedBlog = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      responseAfter = await api.get("/api/blogs");
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
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });
  });

  describe("Updating a specific blog", () => {
    test("likes is updated successsfully", async () => {
      const putResponse = await api
        .put("/api/blogs/5a422aa71b54a676234d17f8")
        .send({ likes: 666 })
        .expect(200);

      const responseAfterUpdate = await api.get(
        "/api/blogs/5a422aa71b54a676234d17f8"
      );
      const likesAfterUpdate = responseAfterUpdate.body.likes;

      assert.strictEqual(putResponse.body.likes, likesAfterUpdate);
    });
  });

  describe("Deleting a specific blog", () => {
    test("blog is deleted successfully", async () => {
      const responseBefore = await api.get("/api/blogs");
      const blogCountBeforeDeleting = responseBefore.body.length;

      await api.delete("/api/blogs/5a422aa71b54a676234d17f8").expect(204);

      const responseAfter = await api.get("/api/blogs");
      const blogCountAfterDeleting = responseAfter.body.length;

      assert.strictEqual(blogCountBeforeDeleting - 1, blogCountAfterDeleting);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
