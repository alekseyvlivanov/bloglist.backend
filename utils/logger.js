const error = (...params) => {
  console.error(...params);
};

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

module.exports = {
  error,
  info,
};
