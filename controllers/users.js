const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();

const User = require('../models/user.js');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { body } = request;

  if (!body.password) {
    return response.status(400).json({ error: 'password is required' });
  }

  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be 3 symbols at least' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  return response.json(savedUser);
});

module.exports = usersRouter;
