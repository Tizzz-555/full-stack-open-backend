const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const {
  listWithNoBlogs,
  listWithOneBlog,
  blogs,
} = require("../data/blogsData");

describe("favorite blog", () => {
  const testResult = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    likes: 5,
  };
  test("when list has only one blog, return that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, testResult);
  });

  test("when list has many blogs, return the blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    const testResult = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    };
    assert.deepStrictEqual(result, testResult);
  });

  test("when list has no blogs, return an error message", () => {
    const result = listHelper.favoriteBlog(listWithNoBlogs);
    assert.strictEqual(result, "There are no blog posts");
  });
});
