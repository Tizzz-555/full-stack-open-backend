const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const {
  listWithNoBlogs,
  listWithOneBlog,
  blogs,
} = require("../data/blogsData");

describe("most likes", () => {
  const testResult = {
    author: "Edsger W. Dijkstra",
    likes: 5,
  };

  test("when list has only one blog, return the author and the blog's likes", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    assert.deepStrictEqual(result, testResult);
  });

  test("when list has many blogs, return the author who got the most likes and how many they got", () => {
    const result = listHelper.mostLikes(blogs);
    const testResult = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };
    assert.deepStrictEqual(result, testResult);
  });

  test("when list has no blogs, return an error message", () => {
    const result = listHelper.mostLikes(listWithNoBlogs);
    assert.strictEqual(result, "There are no blog posts");
  });
});
