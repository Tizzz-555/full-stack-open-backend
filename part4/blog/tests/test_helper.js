const User = require("../models/user");
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Test blog 1",
    author: "Tizzz",
    url: "www.myblog.com",
    likes: 58,
    id: "667fe7216ad13934d66d0147",
  },
  {
    title: "Test blog 2",
    author: "Tiuz",
    url: "www.myblog.com",
    likes: 12,
    id: "66842c23593731791022d4e9",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    url: "http://fakeurl.com",
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
