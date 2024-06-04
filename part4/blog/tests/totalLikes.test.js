const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const {
  listWithNoBlogs,
  listWithOneBlog,
  blogs,
} = require("../data/blogsData");

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has many blogs, equals the sum of all blogs' likes", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });

  test("when list has no blogs, there will be 0 likes", () => {
    const result = listHelper.totalLikes(listWithNoBlogs);
    assert.strictEqual(result, 0);
  });
});
