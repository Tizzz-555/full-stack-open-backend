const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogposts) => {
  let sum = 0;
  blogposts.forEach((b) => (sum += b.likes));
  return sum;
};
const listWithNoBlogs = [];

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
console.log(favoriteBlog(listWithNoBlogs));
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
