/* eslint-disable no-underscore-dangle */
const blogsRouter = require('express').Router();

const Blog = require('../models/blog.js');
const User = require('../models/user.js');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { body } = request;

  if (!body.title && !body.author) {
    response.status(400).end();
  } else {
    const users = await User.find({});
    const user = users[0];
    const userJSON = user.toJSON();

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: userJSON.id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    context: 'query',
    new: true,
    runValidators: true,
  });

  response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;
