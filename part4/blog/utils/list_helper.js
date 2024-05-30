const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogposts) => {
  // const allLikes = [];
  // blogposts.forEach((b) => allLikes.push(b));

  // console.log(allLikes);

  // const reducer = (sum, item) => {
  //   return sum + item;
  // };

  // return allLikes.reduce(reducer, 0);
  let sum = 0;
  blogposts.forEach((b) => (sum += b.likes));
  return sum;
};
module.exports = {
  dummy,
  totalLikes,
};
