const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogposts) => {
  let sum = 0;
  blogposts.forEach((b) => (sum += b.likes));
  return sum;
};

const favoriteBlog = (blogposts) => {
  let mostLikes = 0;
  let tmpObj = {};
  if (blogposts.length > 0) {
    blogposts.forEach((b) => {
      if (b.likes > mostLikes) {
        mostLikes = b.likes;
        tmpObj.title = b.title;
        tmpObj.author = b.author;
        tmpObj.likes = b.likes;
      }
    });
    return tmpObj;
  } else {
    return "There are no blog posts";
  }
};

// const blogs = [
//   {
//     _id: "5a422a851b54a676234d17f7",
//     title: "React patterns",
//     author: "Michael Chan",
//     url: "https://reactpatterns.com/",
//     likes: 7,
//     __v: 0,
//   },
//   {
//     _id: "5a422aa71b54a676234d17f8",
//     title: "Go To Statement Considered Harmful",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//     likes: 5,
//     __v: 0,
//   },
//   {
//     _id: "5a422b3a1b54a676234d17f9",
//     title: "Canonical string reduction",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//     likes: 12,
//     __v: 0,
//   },
//   {
//     _id: "5a422b891b54a676234d17fa",
//     title: "First class tests",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//     likes: 10,
//     __v: 0,
//   },
//   {
//     _id: "5a422ba71b54a676234d17fb",
//     title: "TDD harms architecture",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//     likes: 0,
//     __v: 0,
//   },
//   {
//     _id: "5a422bc61b54a676234d17fc",
//     title: "Type wars",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//     likes: 2,
//     __v: 0,
//   },
// ];

const mostBlogs = (blogposts) => {
  if (blogposts.length > 0) {
    let counterObj = _.countBy(blogposts, "author");
    let convertedArray = Object.keys(counterObj).map((key) => ({
      author: key,
      blogs: counterObj[key],
    }));
    let biggestObj = _.maxBy(convertedArray, (o) => {
      return o.blogs;
    });
    return biggestObj;
  } else {
    return "There are no blog posts";
  }
};

// console.log(mostBlogs(blogs));
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
