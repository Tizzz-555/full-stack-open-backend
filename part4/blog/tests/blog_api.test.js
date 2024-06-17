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

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      await blogObject.save();
    }
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

  test("a blog with no likes is defaulted to 0", async () => {
    const newBlog = {
      title: "PHP patterns",
      author: "Riky Chen",
      url: "https://phppatterns.com/",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const zeroLikesTitle = blogsAtEnd.find((b) => b.title === newBlog.title);

    assert(zeroLikesTitle.likes == 0);
  });

  test("trying to post a blog with no title or url gets a 400 status response", async () => {
    const newBlog = {
      author: "Nicholas Chen",
      likes: 33,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
