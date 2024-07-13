const { test, after, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

describe("when there is initially some blogs saved", () => {
  let token;
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const user = new User({
      username: "Tiuz",
      name: "Matteo",
      passwordHash: await bcrypt.hash("Zanetti", 10),
    });

    const savedUser = await user.save();
    userId = savedUser._id;

    const newLogin = {
      username: "Tiuz",
      password: "Zanetti",
    };
    const res = await api
      .post("/api/login")
      .send(newLogin)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    token = res.body.token;
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog({ ...blog, user: userId });
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

  describe("addition of a new blog", () => {
    test("successfully create a blog post", async () => {
      const newBlog = {
        title: "Una vita da mediano",
        author: "Tiuz",
        url: "https://saneti.com",
        likes: 23,
        user: userId,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(helper.initialBlogs.length + 1, blogsAtEnd.length);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(titles.includes("Una vita da mediano"));
    });

    test("fails with status code 401 if token is not provided", async () => {
      const newBlog = {
        title: "Una vita da mediano",
        author: "Tiuz",
        url: "https://saneti.com",
        likes: 23,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(helper.initialBlogs.length, blogsAtEnd.length);
    });

    test("a blog with no likes is defaulted to 0", async () => {
      const newBlog = {
        title: "Una vita da mediano",
        author: "Tiuz",
        url: "https://saneti.com",
        user: userId,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const zeroLikesBlog = blogsAtEnd.find((b) => b.title === newBlog.title);

      assert(zeroLikesBlog.likes == 0);
    });

    test("trying to post a blog with no title or url gets a 400 status response", async () => {
      const newBlog = {
        author: "Tiuz",
        likes: 23,
        user: userId,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("update of a blog", () => {
    test("succeeds if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];
      const updatedBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 2,
      };

      await api
        .put(`/api/blogs/${blogToView.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);

      const updatedBlogRes = blogsAtEnd.find(
        (b) => b.title === updatedBlog.title
      );
      assert(updatedBlogRes.likes == updatedBlog.likes);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[1];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.delete(`/api/blogs/${invalidId}`).expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
