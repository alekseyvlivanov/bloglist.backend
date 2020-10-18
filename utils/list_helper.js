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

  const [author, authorBlogs] = _.sortBy(
    _.toPairs(_.countBy(blogs, 'author')),
    1,
  ).reverse()[0];

  return {
    author,
    blogs: authorBlogs,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const reducer = (acc, item) => {
    acc[item.author] = _.get(acc, item.author, 0) + item.likes;
    return acc;
  };

  const [author, authorLikes] = _.sortBy(
    _.toPairs(blogs.reduce(reducer, {})),
    1,
  ).reverse()[0];

  return { author, likes: authorLikes };
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;

  return blogs.reduce(reducer, 0);
};

module.exports = { dummy, favoriteBlog, mostBlogs, mostLikes, totalLikes };
