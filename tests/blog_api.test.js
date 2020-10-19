/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "request.*.expect"] }] */
/* eslint-disable no-underscore-dangle */
const { afterAll, expect, test, beforeEach } = require('@jest/globals');

const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../app.js');
const Blog = require('../models/blog.js');
const { initialBlogs } = require('./test_helper.js');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await request(app)
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await request(app).get('/api/blogs');

  expect(response.body.length).toBe(initialBlogs.length);
});

test('blogs have id property instead of _id', async () => {
  const response = await request(app).get('/api/blogs');
  const blog = response.body[0];

  expect(blog.id).toBeDefined();
  expect(blog._id).not.toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
