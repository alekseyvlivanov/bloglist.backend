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

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;

  return blogs.reduce(reducer, 0);
};

module.exports = { dummy, favoriteBlog, totalLikes };
