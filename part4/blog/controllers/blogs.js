const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "user missing or invalid" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ error: "comment is required" });
  }
  const blog = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });
  blog.comments = blog.comments.concat(comment);
  await blog.save();
  res.status(201).json(blog);
});

blogsRouter.put("/:id", async (req, res) => {
  const body = req.body;

  const likes = {
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, likes, {
    new: true,
  }).populate("user", { username: 1, name: 1 });
  res.json(updatedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const user = req.user;
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(blog.id);
    res.status(204).end();
  } else {
    res
      .status(401)
      .json({ error: "You don't have permission to delete this message" });
  }
});
module.exports = blogsRouter;
