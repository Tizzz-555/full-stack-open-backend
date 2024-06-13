const { test, after, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

describe("blog api test", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    let blogObject = new Blog(helper.initialBlogs[0]);
    await blogObject.save();

    blogObject = new Blog(helper.initialBlogs[1]);
    await blogObject.save();
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

  test("unique identifier is returned as 'id'", async () => {
    const response = await api.get("/api/blogs");

    assert.deepStrictEqual(
      response.body.every((b) => b.hasOwnProperty("id")),
      true
    );
  });

  test("succesfully create a blog post", async () => {
    const newBlog = {
      title: "Python patterns",
      author: "Nicholas Chen",
      url: "https://pythonpatterns.com/",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(helper.initialBlogs.length + 1, blogsAtEnd.length);

    const titles = blogsAtEnd.map((b) => b.title);
    assert(titles.includes("Python patterns"));
  });
});

after(async () => {
  await mongoose.connection.close();
});
