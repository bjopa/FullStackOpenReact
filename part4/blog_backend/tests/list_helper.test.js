const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blogList = require("./testData/blogList");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = blogList.listWithOneBlog;

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });
});

describe("favorite blog", () => {
  const result = listHelper.favoriteBlog(blogList.listWithMultipleBlogs);

  assert.deepStrictEqual(result, {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12,
  });
});

describe("author with most blogs", () => {
  const result = listHelper.mostBlogs(blogList.listWithMultipleBlogs);

  assert.deepStrictEqual(result, {
    author: "Robert C. Martin",
    blogs: 3,
  });
});

describe("author with most likes in total", () => {
  const result = listHelper.mostLikesTotal(blogList.listWithMultipleBlogs);

  assert.deepStrictEqual(result, {
    author: "Edsger W. Dijkstra",
    likes: 17,
  });
});
