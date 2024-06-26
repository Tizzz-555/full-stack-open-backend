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

const mostLikes = (blogposts) => {
  if (blogposts.length > 0) {
    let counterObj = {};

    blogposts.forEach((b) => {
      if (_.has(counterObj, b.author)) {
        counterObj[b.author] += b.likes;
      } else {
        counterObj[b.author] = b.likes;
      }
    });

    let convertedArray = Object.keys(counterObj).map((key) => ({
      author: key,
      likes: counterObj[key],
    }));

    let biggestObj = _.maxBy(convertedArray, (o) => {
      return o.likes;
    });
    return biggestObj;
  } else {
    return "There are no blog posts";
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
