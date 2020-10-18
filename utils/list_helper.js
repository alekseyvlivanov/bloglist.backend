const _ = require('lodash');

const dummy = () => {
  return 1;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const reducer = (fav, item) => (item.likes > fav.likes ? item : fav);
  const { title, author, likes } = blogs.reduce(reducer);

  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const [author, countedBlogs] = _.sortBy(
    _.toPairs(_.countBy(blogs, 'author')),
    1,
  ).reverse()[0];

  return {
    author,
    blogs: countedBlogs,
  };
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;

  return blogs.reduce(reducer, 0);
};

module.exports = { dummy, favoriteBlog, mostBlogs, totalLikes };
